import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUrl';
import { AlertCircle, CheckCircle } from 'lucide-react';

const DashboardOverview = () => {
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === 'admin';
    const isApproved = currentUser?.approved === true || currentUser?.approved === 1 || isAdmin;

    const [showApprovedMessage, setShowApprovedMessage] = React.useState(false);

    React.useEffect(() => {
        if (isApproved) {
            const storageKey = `hasSeenApprovedMessage_${currentUser?.id || 'user'}`;
            const hasSeenMessage = localStorage.getItem(storageKey);

            if (!hasSeenMessage) {
                setShowApprovedMessage(true);
                localStorage.setItem(storageKey, 'true');
                
                const timer = setTimeout(() => {
                    setShowApprovedMessage(false);
                }, 10000);
                return () => clearTimeout(timer);
            }
        }
    }, [isApproved, currentUser?.id]);

    const [imgError, setImgError] = React.useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Dashboard Overview</h1>
            </div>

            {/* Approval Status Banner */}
            {!isApproved && !isAdmin && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
                        <div>
                            <p className="font-medium text-yellow-800">Account Pending Approval</p>
                            <p className="text-sm text-yellow-700">Your account is waiting for admin approval. You can view your profile but cannot access other features yet.</p>
                        </div>
                    </div>
                </div>
            )}

            {isApproved && showApprovedMessage && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg transition-opacity duration-500">
                    <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                        <div>
                            <p className="font-medium text-green-800">Account Approved</p>
                            <p className="text-sm text-green-700">Your account is active. You can now access all features.</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* User Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Your Profile</h2>
                <div className="flex items-center space-x-4">
                    {currentUser?.picture && !imgError ? (
                        <img
                            src={getImageUrl(currentUser.picture)}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 transition-all duration-300"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-semibold border-2 border-gray-200 dark:border-gray-600 shadow-md">
                            {(currentUser?.name || currentUser?.displayName || 'U')[0].toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                            {currentUser?.name || currentUser?.displayName || 'User'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{currentUser?.email}</p>
                        <div className="mt-2 flex gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isAdmin 
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                            } transition-colors duration-300`}>
                                {isAdmin ? 'Admin' : 'User'}
                            </span>
                            {!isAdmin && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    isApproved 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                } transition-colors duration-300`}>
                                    {isApproved ? 'Approved' : 'Pending'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid (only show if approved or admin) */}
            {(isApproved || isAdmin) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors duration-300">{isAdmin ? 'Total Users' : 'My Listings'}</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 transition-colors duration-300">0</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                         <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors duration-300">{isAdmin ? 'Total Cars' : 'Pending Approval'}</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 transition-colors duration-300">0</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                         <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors duration-300">Active Listings</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 transition-colors duration-300">0</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;
