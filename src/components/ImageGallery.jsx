import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const ImageGallery = ({ images, title }) => {
    const [activeImage, setActiveImage] = useState(0);

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

    // Auto-slide effect
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeImage, images.length]); // Reset timer on activeImage change

    return (
        <div className="space-y-4">
            <div className="bg-gray-100 rounded-xl overflow-hidden h-[600px] relative group">
                {images.length > 0 ? (
                    <>
                        <img 
                            src={getImageUrl(images[activeImage])} 
                            alt={title} 
                            className="w-full h-full object-cover transition-transform duration-500" 
                        />
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                        <button 
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === index ? 'border-indigo-600' : 'border-transparent'}`}
                        >
                            <img src={getImageUrl(img)} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
