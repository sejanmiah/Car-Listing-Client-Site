import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUrl';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await api.put(`/auth/users/${userId}/approve`);
            fetchUsers();
            alert('User approved successfully!');
        } catch (error) {
            console.error("Error approving user:", error);
            alert('Failed to approve user');
        }
    };

    const handleReject = async (userId) => {
        if (!window.confirm("Are you sure you want to reject (delete) this user request?")) return;
        try {
            // Assuming we reject by deleting the user for now, as we don't have a 'rejected' status
            // You might want to implement a 'rejected' status in the future
            await api.delete(`/auth/users/${userId}`); 
            fetchUsers();
            alert('User request rejected.');
        } catch (error) {
            console.error("Error rejecting user:", error);
            alert('Failed to reject user');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

    const pendingUsers = users.filter(user => {
        if (user.role === 'admin') return false;
        const isApproved = user.approved === true || user.approved === 1;
        return !isApproved;
    });

    const approvedUsers = users.filter(user => {
        if (user.role === 'admin') return false;
        const isApproved = user.approved === true || user.approved === 1;
        return isApproved;
    });

    const UserTable = ({ data, showActions }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                <thead className="bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Joined</th>
                        {showActions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                No users found in this category.
                            </td>
                        </tr>
                    ) : (data.map((user) => {
                        const isApproved = user.approved === true || user.approved === 1 || user.role === 'admin';
                        return (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {user.picture ? (
                                            <img 
                                                src={getImageUrl(user.picture)} 
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-indigo-600" />
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{user.name || 'No Name'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'} transition-colors duration-300`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isApproved ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 transition-colors duration-300">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 transition-colors duration-300">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                {showActions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        {!isApproved && (
                                            <button 
                                                onClick={() => handleApprove(user.id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleReject(user.id)}
                                            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-900/30"
                                        >
                                            {isApproved ? 'Remove' : 'Reject'}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    }))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">User Management</h1>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Total Users: {users.filter(u => u.role !== 'admin').length}
                </div>
            </div>

            {/* Pending Requests Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Clock className="text-yellow-600 dark:text-yellow-500 w-5 h-5 transition-colors duration-300" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-300">Pending Requests ({pendingUsers.length})</h2>
                </div>
                <UserTable data={pendingUsers} showActions={true} />
            </div>

            {/* Approved Users Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-600 dark:text-green-500 w-5 h-5 transition-colors duration-300" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-300">Approved Users ({approvedUsers.length})</h2>
                </div>
                <UserTable data={approvedUsers} showActions={true} />
            </div>
        </div>
    );
};

export default UserManagement;
