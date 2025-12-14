import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Package, AlertTriangle, TrendingUp, DollarSign, Plus } from 'lucide-react';
import AddSweetModal from '../components/sweets/AddSweetModal';

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchSweets = async () => {
        try {
            const response = await api.get('/sweets');
            setSweets(response.data);
        } catch (error) {
            console.error('Error fetching sweets:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleRestock = async (id) => {
        try {
            await api.post(`/sweets/${id}/restock`, { quantity: 20 });
            toast.success('Restocked successfully (+20)');
            fetchSweets(); // Refresh data
        } catch (error) {
            toast.error('Failed to restock');
        }
    };

    const stats = {
        totalSweets: sweets.length,
        lowStock: sweets.filter(s => s.stockQuantity < 20).length,
        outOfStock: sweets.filter(s => s.stockQuantity === 0).length,
        totalValue: sweets.reduce((acc, s) => acc + (s.price * s.stockQuantity), 0)
    };

    const displayedSweets = showLowStockOnly
        ? sweets.filter(s => s.stockQuantity < 20)
        : sweets;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-bakery-cream">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-bakery-light-brown/20 border-t-bakery-orange"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bakery-cream p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-bakery-brown">Dashboard</h1>
                        <p className="text-bakery-light-brown transform translate-y-1">Welcome back, Admin</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-bakery-orange text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-bakery-orange/20 hover:bg-bakery-brown transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </header>

                <AddSweetModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={fetchSweets}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-bakery-brown/5 border border-bakery-brown/5 flex items-center gap-4">
                        <div className="p-3 bg-bakery-orange/10 rounded-xl">
                            <Package className="w-8 h-8 text-bakery-orange" />
                        </div>
                        <div>
                            <p className="text-sm text-bakery-light-brown font-medium">Total Products</p>
                            <p className="text-2xl font-bold text-bakery-brown">{stats.totalSweets}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-bakery-brown/5 border border-bakery-brown/5 flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-bakery-light-brown font-medium">Low Stock Alerts</p>
                            <p className="text-2xl font-bold text-bakery-brown">{stats.lowStock}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-bakery-brown/5 border border-bakery-brown/5 flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-bakery-light-brown font-medium">Active Items</p>
                            <p className="text-2xl font-bold text-bakery-brown">{stats.totalSweets - stats.outOfStock}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-bakery-brown/5 border border-bakery-brown/5 flex items-center gap-4">
                        <div className="p-3 bg-bakery-brown/10 rounded-xl">
                            <DollarSign className="w-8 h-8 text-bakery-brown" />
                        </div>
                        <div>
                            <p className="text-sm text-bakery-light-brown font-medium">Inventory Value</p>
                            <p className="text-2xl font-bold text-bakery-brown">₹{stats.totalValue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-3xl shadow-xl shadow-bakery-brown/5 border border-bakery-brown/10 overflow-hidden">
                    <div className="p-6 border-b border-bakery-brown/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-bakery-brown">Current Inventory</h2>
                            <span className="text-sm text-bakery-light-brown">Manage all products</span>
                        </div>
                        <div className="flex items-center gap-2 bg-bakery-cream p-1 rounded-lg">
                            <button
                                onClick={() => setShowLowStockOnly(false)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!showLowStockOnly ? 'bg-white text-bakery-brown shadow-sm' : 'text-bakery-light-brown hover:text-bakery-brown'}`}
                            >
                                All Items
                            </button>
                            <button
                                onClick={() => setShowLowStockOnly(true)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${showLowStockOnly ? 'bg-white text-red-600 shadow-sm' : 'text-bakery-light-brown hover:text-red-500'}`}
                            >
                                Low Stock
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-bakery-cream/50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-bakery-brown">Product Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-bakery-brown">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-bakery-brown">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-bakery-brown">Stock Level</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-bakery-brown">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-bakery-brown/5">
                                {displayedSweets.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-bakery-light-brown">
                                            {showLowStockOnly ? 'No low stock items found.' : 'No products found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    displayedSweets.map((item) => (
                                        <tr key={item._id} className="hover:bg-bakery-cream/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                                    />
                                                    <span className="font-medium text-bakery-brown">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-bakery-light-brown">{item.category}</td>
                                            <td className="px-6 py-4 text-bakery-brown font-medium">₹{item.price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stockQuantity === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : item.stockQuantity < 20
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {item.stockQuantity === 0 ? 'Out of Stock' : `${item.stockQuantity} Units`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRestock(item._id)}
                                                    className="text-sm bg-bakery-brown text-white px-4 py-2 rounded-lg hover:bg-bakery-orange transition-colors shadow-sm"
                                                >
                                                    Restock (+20)
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
