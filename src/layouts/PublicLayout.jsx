import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogIn, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const PublicLayout = () => {
    const { currentUser, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userPicture, setUserPicture] = useState(null);
    const dropdownRef = useRef(null);

    // Fetch user profile including custom picture
    useEffect(() => {
        if (currentUser) {
            const fetchUserProfile = async () => {
                try {
                    const response = await api.get('/users/profile');
                    setUserPicture(response.data.picture);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };
            fetchUserProfile();
        }
    }, [currentUser]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setDropdownOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Use custom picture if available, otherwise fall back to Firebase photoURL
    const displayPicture = getImageUrl(userPicture) || currentUser?.photoURL;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                            <Car size={28} />
                            <span>CarMarket</span>
                        </Link>

                        <nav className="hidden md:flex gap-8">
                            <NavLink to="/" className={({ isActive }) => `text-sm font-medium hover:text-indigo-600 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>Home</NavLink>
                            <NavLink to="/cars" className={({ isActive }) => `text-sm font-medium hover:text-indigo-600 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>Browse Cars</NavLink>
                        </nav>

                        <div className="flex items-center gap-4">
                            {currentUser ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        {displayPicture ? (
                                            <img 
                                                src={displayPicture} 
                                                alt={currentUser.displayName || 'User'} 
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                                {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-700 hidden md:block">
                                            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <LayoutDashboard size={16} />
                                                <span>Dashboard</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    <LogIn size={18} />
                                    <span>Sign In</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-400 text-sm">&copy; {new Date().getFullYear()} CarMarket. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
