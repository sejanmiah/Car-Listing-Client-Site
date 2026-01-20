import React from 'react';
import { Search } from 'lucide-react';

const FilterSidebar = ({ 
    searchTerm, 
    setSearchTerm, 
    selectedBrand, 
    setSelectedBrand, 
    priceRange, 
    setPriceRange, 
    brands 
}) => {
    return (
        <div className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4">Filters</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Keywords..." 
                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <select 
                            className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                            <option value="">All Brands</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="100000000" 
                            step="10000"
                            className="w-full"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>$0</span>
                            <span>${priceRange.max.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
