import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="bg-indigo-600 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Find Your Dream Car</h1>
                <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">Browse thousands of trusted car listings from verified sellers. Buy with confidence today.</p>
                
                <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
                    <div className="flex-1 flex items-center px-6">
                        <Search className="text-gray-400 mr-2" />
                        <input 
                            type="text" 
                            placeholder="Search by brand, model, or keyword..." 
                            className="w-full focus:outline-none text-gray-800"
                        />
                    </div>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors">
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
