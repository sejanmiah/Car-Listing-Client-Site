import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { getImageUrl } from '../../../utils/imageUrl';

const AdminCarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        try {
            const response = await api.get('/cars/admin');
            setCars(response.data);
        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/cars/admin/${id}/status`, { status });
            // Optimistic update or refetch
            setCars(cars.map(car => car.id === id ? { ...car, status } : car));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Review Listings</h1>
            <div className="grid grid-cols-1 gap-6">
                {cars.map((car) => (
                    <div key={car.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-6 transition-colors duration-300">
                        <div className="w-full md:w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 transition-colors duration-300">
                             {car.images && JSON.parse(car.images)[0] ? (
                                <img src={getImageUrl(JSON.parse(car.images)[0])} alt={car.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">No Image</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300">{car.year} {car.brand} {car.model}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">{car.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Sold by: {car.user_email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase transition-colors duration-300 ${
                                    car.status === 'approved' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 
                                    car.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' : 
                                    'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                                }`}>
                                    {car.status}
                                </span>
                            </div>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-2 text-xl transition-colors duration-300">${Number(car.price).toLocaleString()}</p>
                            
                            <div className="mt-4 flex gap-3">
                                {car.status !== 'approved' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(car.id, 'approved')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                )}
                                {car.status !== 'rejected' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(car.id, 'rejected')}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCarList;
