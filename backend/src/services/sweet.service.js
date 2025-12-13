import sweetRepository from '../repositories/sweet.repository.js';

class SweetService {
    async createSweet(sweetData) {
        return await sweetRepository.create(sweetData);
    }

    async getAllSweets(filter = {}) {
        return await sweetRepository.findAll(filter);
    }

    async searchSweets(query) {
        const { name, category, minPrice, maxPrice } = query;
        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        return await sweetRepository.findAll(filter);
    }

    async getSweetById(id) {
        const sweet = await sweetRepository.findById(id);
        if (!sweet) {
            const error = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }
        return sweet;
    }

    async updateSweet(id, sweetData) {
        const sweet = await sweetRepository.update(id, sweetData);
        if (!sweet) {
            const error = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }
        return sweet;
    }

    async deleteSweet(id) {
        const sweet = await sweetRepository.delete(id);
        if (!sweet) {
            const error = new Error('Sweet not found');
            error.statusCode = 404;
            throw error;
        }
        return sweet;
    }
}

export default new SweetService();
