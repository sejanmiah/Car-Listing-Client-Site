import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { MapPin, Calendar, Clock, DollarSign, User, ArrowLeft, Share2, X, Send } from 'lucide-react';

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '' });
    const [submitStatus, setSubmitStatus] = useState('idle'); // idle, submitting, success, error

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');
        try {
            await api.post('/leads', {
                car_id: car.id,
                ...contactForm
            });
            setSubmitStatus('success');
            setTimeout(() => {
                setShowContactModal(false);
                setSubmitStatus('idle');
                setContactForm({ name: '', email: '', phone: '' });
            }, 2000);
        } catch (error) {
            console.error("Error submitting lead:", error);
            setSubmitStatus('error');
        }
    };

    useEffect(() => {
        const fetchCar = async () => {
            try {
                // Currently fetching all and finding one logic because details API isn't separate yet
                // Ideally backend should have GET /cars/:id
                // Using the specific user/admin endpoint might fail for public
                // Let's rely on the public list for now or add the endpoint quickly
                const response = await api.get('/cars');
                const foundCar = response.data.find(c => c.id === parseInt(id));
                setCar(foundCar);
            } catch (error) {
                console.error("Error fetching car details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!car) return <div className="min-h-screen flex items-center justify-center">Car not found</div>;

    const images = car.images ? JSON.parse(car.images) : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6">
                <ArrowLeft size={20} /> Back to Listings
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Images */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-gray-100 rounded-xl overflow-hidden h-96 relative group">
                        {images.length > 0 ? (
                            <img src={getImageUrl(images[activeImage])} alt={car.title} className="w-full h-full object-cover" />
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

                {/* Right Column: Details */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-indigo-600 font-bold uppercase tracking-wide">{car.brand}</p>
                                <h1 className="text-3xl font-bold text-gray-900 mt-1">{car.year} {car.model}</h1>
                            </div>
                            <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                        
                        <div className="mt-6 flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-gray-900">${Number(car.price).toLocaleString()}</span>
                        </div>

                        <div className="mt-8 space-y-4 pt-8 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><Calendar size={18}/> Year</span>
                                <span className="font-medium">{car.year}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><Clock size={18}/> Listed</span>
                                <span className="font-medium">{new Date(car.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowContactModal(true)}
                            className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Contact Seller
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-lg mb-4">Description</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {car.description || "No description provided."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Seller Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-900">Contact Seller</h3>
                            <button 
                                onClick={() => setShowContactModal(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {submitStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                                    <p className="text-gray-500">The seller has been notified and will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={contactForm.name}
                                            onChange={e => setContactForm({...contactForm, name: e.target.value})}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={contactForm.email}
                                            onChange={e => setContactForm({...contactForm, email: e.target.value})}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            required
                                            value={contactForm.phone}
                                            onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    
                                    {submitStatus === 'error' && (
                                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                            Something went wrong. Please try again.
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={submitStatus === 'submitting'}
                                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                                        {!submitStatus === 'submitting' && <Send size={18} />}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetails;
