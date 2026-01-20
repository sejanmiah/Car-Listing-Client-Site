import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import FilterSidebar from '../components/FilterSidebar';

const BrowseCars = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
    const [selectedBrand, setSelectedBrand] = useState('');

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await api.get('/cars');
                setCars(response.data);
                setFilteredCars(response.data);
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    useEffect(() => {
        let result = cars;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(car => 
                car.title.toLowerCase().includes(lowerTerm) || 
                car.brand.toLowerCase().includes(lowerTerm) || 
                car.model.toLowerCase().includes(lowerTerm)
            );
        }

        if (selectedBrand) {
            result = result.filter(car => car.brand === selectedBrand);
        }

        result = result.filter(car => Number(car.price) >= priceRange.min && Number(car.price) <= priceRange.max);

        setFilteredCars(result);
    }, [searchTerm, selectedBrand, priceRange, cars]);

    const brands = [...new Set(cars.map(car => car.brand))];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Cars</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <FilterSidebar 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    brands={brands}
                />

                {/* Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCars.map((car) => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    )}
                    
                    {!loading && filteredCars.length === 0 && (
                         <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">No cars found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowseCars;
