import express from 'express';
import sweetController from '../controllers/sweet.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', sweetController.getAllSweets);
router.get('/search', sweetController.searchSweets);
router.get('/:id', sweetController.getSweetById);

// Protected routes
router.post('/', protect, authorize('admin', 'staff'), sweetController.createSweet);
router.put('/:id', protect, authorize('admin', 'staff'), sweetController.updateSweet);
router.delete('/:id', protect, authorize('admin'), sweetController.deleteSweet);

// Inventory routes
router.post('/:id/purchase', protect, sweetController.purchaseSweet);
router.post('/:id/restock', protect, authorize('admin'), sweetController.restockSweet);

export default router;
