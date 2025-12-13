import sweetService from '../services/sweet.service.js';

class SweetController {
    async createSweet(req, res) {
        try {
            const { name, price, description, category, imageUrl, stockQuantity, isAvailable } = req.body;

            // Basic validation
            if (!name || !price || !description || !category || !imageUrl) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const sweet = await sweetService.createSweet({
                name,
                price,
                description,
                category,
                imageUrl,
                stockQuantity,
                isAvailable
            });
            res.status(201).json(sweet);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Create Sweet Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async getAllSweets(req, res) {
        try {
            const sweets = await sweetService.getAllSweets();
            res.status(200).json(sweets);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Get Sweets Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async searchSweets(req, res) {
        try {
            const sweets = await sweetService.searchSweets(req.query);
            res.status(200).json(sweets);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Search Sweets Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async getSweetById(req, res) {
        try {
            const sweet = await sweetService.getSweetById(req.params.id);
            res.status(200).json(sweet);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Get Sweet By Id Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async updateSweet(req, res) {
        try {
            const sweet = await sweetService.updateSweet(req.params.id, req.body);
            res.status(200).json(sweet);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Update Sweet Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async deleteSweet(req, res) {
        try {
            await sweetService.deleteSweet(req.params.id);
            res.status(200).json({ message: 'Sweet deleted successfully' });
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Delete Sweet Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async purchaseSweet(req, res) {
        try {
            const { quantity } = req.body;
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid quantity' });
            }

            const sweet = await sweetService.purchaseSweet(req.params.id, quantity);
            res.status(200).json(sweet);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Purchase Sweet Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async restockSweet(req, res) {
        try {
            const { quantity } = req.body;
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid quantity' });
            }

            const sweet = await sweetService.restockSweet(req.params.id, quantity);
            res.status(200).json(sweet);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Restock Sweet Error:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }
}

export default new SweetController();
