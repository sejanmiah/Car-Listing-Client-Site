import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthError(null); // Clear previous errors
      if (user) {
        try {
            const idToken = await user.getIdToken();
            const response = await api.post('/auth/login', { token: idToken });
            const { token: appToken, user: dbUser } = response.data;
            
            setToken(appToken);
            localStorage.setItem("token", appToken);
            setCurrentUser({ ...user, ...dbUser });
        } catch (error) {
            console.error("Backend login failed", error);
            // Critical: If backend login fails, we must NOT set the user as logged in.
            // Using raw firebase user means missing 'role' and 'approved' fields, causing UI bugs.
            setCurrentUser(null);
            setToken(null);
            localStorage.removeItem("token");
            await signOut(auth); // Force logout from firebase to sync states
            
            setAuthError(
                error.response?.data?.message || 
                error.message || 
                "Failed to connect to backend server"
            );
        }
      } else {
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signupWithEmail = async (email, password, name) => {
    setAuthError(null);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with name
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  };

  const loginWithEmail = (email, password) => {
    setAuthError(null);
    return signInWithEmailAndPassword(auth, email, password);
  };

  /* REMOVED signupWithPhone */

  const loginWithPhone = (phone, password) => {
    // REMOVED
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  const logout = () => {
    setAuthError(null);
    return signOut(auth);
  };

  const value = {
    currentUser,
    token,
    authError,
    loginWithGoogle,
    signupWithEmail,
    loginWithEmail,
    // signupWithPhone, // REMOVED
    // loginWithPhone, // REMOVED
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
