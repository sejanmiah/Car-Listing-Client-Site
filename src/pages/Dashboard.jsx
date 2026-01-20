import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {currentUser?.displayName || currentUser?.email}</span>
                    <button 
                        onClick={logout} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-4">Your Listings</h2>
                <p>No listings yet.</p>
            </div>
        </div>
    );
};

export default Dashboard;
