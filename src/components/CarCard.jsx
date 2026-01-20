import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Gauge } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const CarCard = ({ car }) => {
    return (
        <Link to={`/cars/${car.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden block">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
                {car.images && JSON.parse(car.images)[0] ? (
                    <img 
                        src={getImageUrl(JSON.parse(car.images)[0])} 
                        alt={car.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{car.year} {car.brand} {car.model}</h3>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-medium">${Number(car.price).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{car.title}</p>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Gauge size={14} />
                        <span>N/A km</span> 
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>Global</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;
