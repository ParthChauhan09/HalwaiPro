import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
        maxLength: [30, 'Name must be at most 30 characters long']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be at least 0']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['Milk Based', 'Non-Milk Based', 'Vegetarian', 'Non-Vegetarian']
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Quantity must be at least 0']
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Sweet', sweetSchema);