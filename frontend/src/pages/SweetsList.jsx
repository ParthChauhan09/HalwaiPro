import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SweetsList = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            const response = await api.get('/sweets');
            setSweets(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sweets:', error);
            toast.error('Failed to load sweets');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Sweets</h1>

            {sweets.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No sweets available at the moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sweets.map((sweet) => (
                        <div key={sweet._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={sweet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={sweet.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-semibold text-gray-900">{sweet.name}</h2>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {sweet.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sweet.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-gray-900">₹{sweet.price}</span>
                                    {!sweet.isAvailable && (
                                        <span className="text-red-500 text-sm font-medium">Out of Stock</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SweetsList;
