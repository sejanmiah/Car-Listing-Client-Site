import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';

const MyListings = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get('/cars/my-listings');
                setCars(response.data);
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">My Listings</h1>

            {cars.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-transparent dark:border-gray-700 transition-colors duration-300">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't listed any cars yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div key={car.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group transition-all duration-300 hover:shadow-md">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative transition-colors duration-300">
                                {car.images && JSON.parse(car.images)[0] ? (
                                    <img src={getImageUrl(JSON.parse(car.images)[0])} alt={car.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 px-2.5 py-1 rounded-md text-xs font-bold uppercase shadow-sm dark:text-white backdrop-blur-sm transition-colors duration-300">
                                    {car.status}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300">{car.year} {car.brand} {car.model}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate transition-colors duration-300">{car.title}</p>
                                <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-2 text-xl transition-colors duration-300">${Number(car.price).toLocaleString()}</p>
                                
                                <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                    <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors duration-300">
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-medium transition-colors duration-300">
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
