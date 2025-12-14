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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Sweets</h1>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                    {/* Name Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            placeholder="e.g. Gulab Jamun"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        >
                            <option value="">All Categories</option>
                            <option value="Milk Based">Milk Based</option>
                            <option value="Non-Milk Based">Non-Milk Based</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                        </select>
                    </div>

                    {/* Min Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="0"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                    </div>

                    {/* Max Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="2000"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : sweets.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No sweets found matching your criteria.
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
