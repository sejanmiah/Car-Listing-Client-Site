import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyListings from './pages/dashboard/MyListings';
import AddCar from './pages/dashboard/AddCar';
import Profile from './pages/dashboard/Profile';
import UserManagement from './pages/dashboard/admin/UserManagement';
import AdminCarList from './pages/dashboard/admin/CarManagement';
import Leads from './pages/dashboard/admin/Leads';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import BrowseCars from './pages/BrowseCars';
import CarDetails from './pages/CarDetails';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<BrowseCars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="cars" element={<MyListings />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="admin/cars" element={<AdminCarList />} />
            <Route path="admin/leads" element={<Leads />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
