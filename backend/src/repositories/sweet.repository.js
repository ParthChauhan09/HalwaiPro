import Sweet from '../models/Sweet.js';

class SweetRepository {

    // Create
    async create(sweetData) {
        const sweet = await Sweet.create(sweetData);
        return sweet;
    }

    // FindAll
    async findAll(filter = {}) {
        const sweets = await Sweet.find(filter);
        return sweets;
    }

    // FindById
    async findById(id) {
        const sweet = await Sweet.findById(id);
        return sweet;
    }

    // Update
    async update(id, sweetData) {
        const sweet = await Sweet.findByIdAndUpdate(id, sweetData, { new: true });
        return sweet;
    }

    // Delete
    async delete(id) {
        const sweet = await Sweet.findByIdAndDelete(id);
        return sweet;
    }

    // DeleteAll
    async deleteAll() {
        const sweets = await Sweet.deleteMany();
        return sweets;
    }

    // Decrease Stock   
    async decreaseStock(id, quantity) {
        const sweet = await Sweet.findByIdAndUpdate(
            id,
            { $inc: { stockQuantity: -quantity } },
            { new: true }
        );
        return sweet;
    }
    
    // Increase Stock
    async increaseStock(id, quantity) {
        const sweet = await Sweet.findByIdAndUpdate(
            id,
            { $inc: { stockQuantity: quantity } },
            { new: true }
        );
        return sweet;
    }
}

export default new SweetRepository();