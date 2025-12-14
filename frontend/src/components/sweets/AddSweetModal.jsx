import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AddSweetModal = ({ isOpen, onClose, onSuccess, sweetToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: 'Milk Based',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sweetToEdit) {
            setFormData({
                name: sweetToEdit.name,
                description: sweetToEdit.description,
                price: sweetToEdit.price,
                stockQuantity: sweetToEdit.stockQuantity,
                category: sweetToEdit.category,
                imageUrl: sweetToEdit.imageUrl
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                stockQuantity: '',
                category: 'Milk Based',
                imageUrl: ''
            });
        }
    }, [sweetToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity),
                isAvailable: Number(formData.stockQuantity) > 0
            };

            if (sweetToEdit) {
                await api.put(`/sweets/${sweetToEdit._id}`, data);
                toast.success('Sweet updated successfully!');
            } else {
                await api.post('/sweets', data);
                toast.success('Sweet added successfully!');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving sweet:', error);
            toast.error(error.response?.data?.message || 'Failed to save sweet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-slide-up border border-bakery-brown/10">
                <div className="flex justify-between items-center p-6 border-b border-bakery-brown/5 bg-bakery-cream/30">
                    <h2 className="text-2xl font-bold text-bakery-brown">{sweetToEdit ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-bakery-brown/10 text-bakery-light-brown transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-bakery-brown mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 p-3 transition-all"
                            placeholder="e.g. Kaju Katli"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-bakery-brown mb-1">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 p-3 transition-all"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-bakery-brown mb-1">Initial Stock</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                required
                                min="0"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 p-3 transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-bakery-brown mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 p-3 transition-all"
                        >
                            <option value="Milk Based">Milk Based</option>
                            <option value="Non-Milk Based">Non-Milk Based</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-bakery-brown mb-1">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            required
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 p-3 transition-all"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-bakery-brown mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full rounded-xl border-bakery-light-brown/30 bg-bakery-cream/50 focus:border-bakery-orange focus:ring-bakery-orange/50 p-3 transition-all"
                            placeholder="Describe the sweet..."
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-bakery-orange text-white py-3.5 rounded-xl font-bold hover:bg-bakery-brown transition-all duration-300 shadow-lg shadow-bakery-orange/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                sweetToEdit ? 'Update Product' : 'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSweetModal;
