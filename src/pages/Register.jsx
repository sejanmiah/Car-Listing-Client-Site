import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const { signupWithEmail, signupWithPhone } = useAuth();
  const navigate = useNavigate();
  
  // Steps: 1 = Input, 2 = Verify Code, 3 = Complete Profile
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('email');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Can keep for now to avoid breaking other parts, but unused
    password: '',
    confirmPassword: '',
    code: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!formData.email) return setError('Email is required');
    
    try {
        setError('');
        setLoading(true);
        // Call backend to send code
        const payload = { email: formData.email };
        await api.post('/auth/send-code', payload);
        
        setMessage(`Verification code sent to ${formData.email}`);
        setStep(2);
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to send code');
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!formData.code) return setError('Code is required');

    try {
        setError('');
        setLoading(true);
        // Verify code
        const payload = { email: formData.email, code: formData.code };
        await api.post('/auth/verify-code', payload);
        
        setMessage('Verified! Please complete your profile.');
        setStep(3);
    } catch (err) {
        setError(err.response?.data?.message || 'Invalid code');
    } finally {
        setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signupWithEmail(formData.email, formData.password, formData.name);
      navigate('/dashboard/profile');
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "Start with your email"}
            {step === 2 && "Verify your email"}
            {step === 3 && "Complete your profile"}
          </p>
        </div>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">{message}</div>}

        {/* STEP 1: Input */}
        {step === 1 && (
            <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                      <input
                        type="email"
                        required
                        className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
            </form>
        )}

        {/* STEP 2: Verify Code */}
        {step === 2 && (
            <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Verification Code sent to {method === 'email' ? formData.email : formData.phone}
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm tracking-widest text-center text-xl"
                    placeholder="123456"
                    maxLength={6}
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Change Email/Number
                        </button>
                    </div>
                </div>
            </form>
        )}

        {/* STEP 3: Complete Profile */}
        {step === 3 && (
            <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {method === 'email' ? 'Email address' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="text"
                    disabled
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 focus:outline-none sm:text-sm cursor-not-allowed"
                    value={method === 'email' ? formData.email : formData.phone}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
        )}

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
