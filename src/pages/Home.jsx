import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import HeroSection from '../components/HeroSection';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get('/cars');
                setCars(response.data);
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Listings */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Latest Arrivals</h2>
                        <p className="text-gray-500 mt-2">Fresh listings added recently</p>
                    </div>
                    <Link to="/cars" className="text-indigo-600 font-medium hover:text-indigo-800">
                        View All Listings &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {cars.slice(0, 8).map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
