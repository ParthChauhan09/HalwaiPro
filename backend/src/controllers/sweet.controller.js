import sweetService from '../services/sweet.service.js';

class SweetController {
    async createSweet(req, res, next) {
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
            next(error);
        }
    }

    async getAllSweets(req, res, next) {
        try {
            const sweets = await sweetService.getAllSweets();
            res.status(200).json(sweets);
        } catch (error) {
            next(error);
        }
    }

    async searchSweets(req, res, next) {
        try {
            const sweets = await sweetService.searchSweets(req.query);
            res.status(200).json(sweets);
        } catch (error) {
            next(error);
        }
    }

    async getSweetById(req, res, next) {
        try {
            const sweet = await sweetService.getSweetById(req.params.id);
            res.status(200).json(sweet);
        } catch (error) {
            next(error);
        }
    }

    async updateSweet(req, res, next) {
        try {
            const sweet = await sweetService.updateSweet(req.params.id, req.body);
            res.status(200).json(sweet);
        } catch (error) {
            next(error);
        }
    }

    async deleteSweet(req, res, next) {
        try {
            await sweetService.deleteSweet(req.params.id);
            res.status(200).json({ message: 'Sweet deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async purchaseSweet(req, res, next) {
        try {
            const { quantity } = req.body;
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid quantity' });
            }

            const sweet = await sweetService.purchaseSweet(req.params.id, quantity);
            res.status(200).json(sweet);
        } catch (error) {
            next(error);
        }
    }

    async restockSweet(req, res, next) {
        try {
            const { quantity } = req.body;
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid quantity' });
            }

            const sweet = await sweetService.restockSweet(req.params.id, quantity);
            res.status(200).json(sweet);
        } catch (error) {
            next(error);
        }
    }
}

export default new SweetController();
