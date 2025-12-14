import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SweetsList = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async (currentFilters = filters) => {
        setLoading(true);
        try {
            const params = {};
            if (currentFilters.name) params.name = currentFilters.name;
            if (currentFilters.category) params.category = currentFilters.category;
            if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice;
            if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;

            const response = await api.get('/sweets/search', { params });
            setSweets(response.data);
        } catch (error) {
            console.error('Error fetching sweets:', error);
            toast.error('Failed to load sweets');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSweets(filters);
    };

    const handlePurchase = async (sweetId) => {
        try {
            await api.post(`/sweets/${sweetId}/purchase`, { quantity: 1 });
            toast.success('Purchase successful!');

            setSweets(prevSweets => prevSweets.map(sweet => {
                if (sweet._id === sweetId) {
                    return {
                        ...sweet,
                        stockQuantity: sweet.stockQuantity - 1
                    };
                }
                return sweet;
            }));
        } catch (error) {
            console.error('Purchase error:', error);
            const message = error.response?.data?.message || 'Failed to purchase';
            toast.error(message);
        }
    };

    const handleReset = () => {
        const resetFilters = {
            name: '',
            category: '',
            minPrice: '',
            maxPrice: ''
        };
        setFilters(resetFilters);
        fetchSweets(resetFilters);
    };

    return (
        <div className="min-h-screen bg-bakery-cream font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-bakery-brown mb-10 text-center tracking-tight">Our Delicious Sweets</h1>

                {/* Search and Filters */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-bakery-brown/5 mb-12 border border-bakery-brown/10">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                        {/* Name Search */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-bakery-brown">Search Name</label>
                            <input
                                type="text"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder="e.g. Gulab Jamun"
                                className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 transition-all duration-200 p-3"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-bakery-brown">Category</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 transition-all duration-200 p-3"
                            >
                                <option value="">All Categories</option>
                                <option value="Milk Based">Milk Based</option>
                                <option value="Non-Milk Based">Non-Milk Based</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Non-Vegetarian">Non-Vegetarian</option>
                            </select>
                        </div>

                        {/* Min Price */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-bakery-brown">Min Price</label>
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                placeholder="0"
                                className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 transition-all duration-200 p-3"
                            />
                        </div>

                        {/* Max Price */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-bakery-brown">Max Price</label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="2000"
                                className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 transition-all duration-200 p-3"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-end gap-3 pb-1">
                            <button
                                type="submit"
                                className="flex-1 bg-bakery-brown text-white px-4 py-3 rounded-xl hover:bg-bakery-light-brown transition-all duration-300 font-medium shadow-lg shadow-bakery-brown/20 transform hover:-translate-y-0.5"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 bg-white text-bakery-brown border border-bakery-brown/20 px-4 py-3 rounded-xl hover:bg-bakery-cream transition-all duration-300 font-medium"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-bakery-light-brown/20 border-t-bakery-orange"></div>
                    </div>
                ) : sweets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-bakery-brown/5">
                        <p className="text-xl text-bakery-light-brown">No sweets found matching your criteria.</p>
                        <button onClick={handleReset} className="mt-4 text-bakery-orange hover:text-bakery-brown font-medium">Clear all filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sweets.map((sweet) => (
                            <div key={sweet._id} className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-bakery-brown/5 hover:shadow-2xl hover:shadow-bakery-brown/10 transition-all duration-500 border border-bakery-brown/5 flex flex-col h-full transform hover:-translate-y-1">
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-bakery-brown/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                    <img
                                        src={sweet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={sweet.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-bakery-brown text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-20">
                                        {sweet.category}
                                    </span>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-2xl font-bold text-bakery-brown group-hover:text-bakery-orange transition-colors">{sweet.name}</h2>
                                    </div>
                                    <p className="text-bakery-light-brown text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">{sweet.description}</p>

                                    <div className="pt-4 border-t border-bakery-brown/5 mt-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-bakery-light-brown uppercase tracking-wider font-semibold">Price</span>
                                                <span className="text-2xl font-bold text-bakery-brown">₹{sweet.price}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-bakery-light-brown uppercase tracking-wider font-semibold">Stock</span>
                                                <span className={`font-bold ${sweet.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {sweet.stockQuantity}
                                                </span>
                                            </div>
                                        </div>

                                        {sweet.stockQuantity > 0 ? (
                                            <button
                                                className="w-full bg-bakery-orange text-white px-6 py-3 rounded-xl hover:bg-bakery-brown transition-all duration-300 font-semibold shadow-lg shadow-bakery-orange/30 active:scale-95"
                                                onClick={() => handlePurchase(sweet._id)}
                                            >
                                                Purchase
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full bg-gray-100 text-gray-400 px-6 py-3 rounded-xl cursor-not-allowed font-medium border border-gray-200"
                                            >
                                                Out of Stock
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SweetsList;
