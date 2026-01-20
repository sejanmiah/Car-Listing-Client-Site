import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';

const AddCar = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        description: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...images, ...Array.from(e.target.files)]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            images.forEach(image => data.append('images', image));

            await api.post('/cars', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/dashboard/cars');
        } catch (error) {
            console.error("Error adding car:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to add car";
            alert(`Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm transition-colors duration-300">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Sell Your Car</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Ad Title</label>
                    <input 
                        name="title" 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Brand</label>
                        <input 
                            name="brand" 
                            required 
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                            value={formData.brand}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Model</label>
                        <input 
                            name="model" 
                            required 
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                            value={formData.model}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Year</label>
                        <input 
                            name="year" 
                            type="number"
                            required 
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                            value={formData.year}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Price (USD)</label>
                        <input 
                            name="price" 
                            type="number"
                            required 
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Description</label>
                    <textarea 
                        name="description" 
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Photos</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                            <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none px-2 transition-colors duration-300">
                                <span>Upload files</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>

                    {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img src={URL.createObjectURL(img)} alt="Preview" className="h-24 w-full object-cover rounded-md" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCar;
