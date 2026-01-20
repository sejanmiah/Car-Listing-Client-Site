import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { Camera, Save, X, User, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';

const Profile = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imgError, setImgError] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        secondary_phone: '',
        country: '',
        city: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        company_name: '',
        role: '',
        created_at: '',
        picture: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setFormData(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size must be less than 5MB');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setImgError(false);
            setError('');
        }
    };

    const handleUploadPicture = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);
            setError('');
            const data = new FormData();
            data.append('picture', selectedFile);

            const response = await api.post('/users/profile/picture', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData(prev => ({ ...prev, picture: response.data.picture }));
            setSelectedFile(null);
            setPreviewUrl('');
            setMessage('Profile picture updated successfully!');
            setTimeout(() => setMessage(''), 3000);
            window.location.reload();
        } catch (error) {
            console.error('Error uploading picture:', error);
            setError('Failed to upload picture');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await api.put('/users/profile', formData);
            setFormData(prev => ({
                ...prev,
                ...response.data.user
            }));
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const displayPicture = !imgError && (previewUrl || getImageUrl(formData.picture) || currentUser?.photoURL);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Profile Settings</h1>

            {message && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column: Picture */}
                <div className="md:col-span-1 space-y-6">
                   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center transition-colors duration-300">
                        <div className="relative mb-4">
                            {displayPicture ? (
                                <img 
                                    src={displayPicture} 
                                    alt="Profile" 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-sm"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-semibold border-4 border-gray-100 dark:border-gray-700 shadow-sm">
                                    {(formData.name || currentUser?.email || 'U')[0].toUpperCase()}
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-md">
                                <Camera size={18} className="text-white" />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{formData.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 transition-colors duration-300">{formData.email}</p>
                        
                        <div className="flex gap-2 mb-2">
                             <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {formData.role?.toUpperCase() || 'USER'}
                             </span>
                        </div>

                        {selectedFile && (
                            <div className="flex gap-2 mt-4 w-full justify-center">
                                <button
                                    onClick={handleUploadPicture}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
                                >
                                    <Save size={14} />
                                    <span>Save</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl('');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm transition-colors duration-300"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                   </div>
                </div>

                {/* Right Column: Details Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
                            <User size={20} className="text-gray-400" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Phone size={20} className="text-gray-400" />
                                Contact Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                                    <input
                                        type="tel"
                                        name="secondary_phone"
                                        value={formData.secondary_phone || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-gray-400" />
                                Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Street Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Briefcase size={20} className="text-gray-400" />
                                Emergency Contact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Contact Name</label>
                                    <input
                                        type="text"
                                        name="emergency_contact_name"
                                        value={formData.emergency_contact_name || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Contact Phone</label>
                                    <input
                                        type="tel"
                                        name="emergency_contact_phone"
                                        value={formData.emergency_contact_phone || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6 flex justify-between items-center transition-colors duration-300">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 transition-colors duration-300">
                                <Calendar size={16} />
                                Joined: {new Date(formData.created_at).toLocaleDateString()}
                            </div>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
                            >
                                <Save size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
