import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import api from '../../utils/api';
import toast from 'react-hot-toast';

vi.mock('../../utils/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn()
    }
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

// Mock child components to expose internal state/callbacks
vi.mock('../../components/sweets/AddSweetModal', () => ({
    default: ({ isOpen, onClose, onSuccess, sweetToEdit }) => isOpen ? (
        <div data-testid="add-modal">
            {sweetToEdit ? `Edit: ${sweetToEdit.name}` : 'Add Mode'}
            <button onClick={onClose}>Close</button>
            <button onClick={() => onSuccess()}>Success</button>
        </div>
    ) : null
}));

vi.mock('../../components/common/DeleteConfirmationModal', () => ({
    default: ({ isOpen, onClose, onConfirm, sweetName }) => isOpen ? (
        <div data-testid="delete-modal">
            Deleting: {sweetName}
            <button onClick={onClose}>Cancel</button>
            <button onClick={onConfirm}>Confirm Delete</button>
        </div>
    ) : null
}));

describe('Dashboard Component', () => {
    const mockSweets = [
        { _id: '1', name: 'Low Stock Item', price: 100, stockQuantity: 5, category: 'Milk', imageUrl: 'img1.jpg' },
        { _id: '2', name: 'Normal Item', price: 200, stockQuantity: 50, category: 'Milk', imageUrl: 'img2.jpg' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders stats and items correctly', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<Dashboard />);

        await waitFor(() => {
            // Stats
            expect(screen.getByText('Total Products')).toBeInTheDocument();
            const twos = screen.getAllByText('2'); // Total and Active
            expect(twos.length).toBeGreaterThanOrEqual(1);
            expect(screen.getByText('1')).toBeInTheDocument(); // Low Stock stats

            // Table items
            expect(screen.getByText('Low Stock Item')).toBeInTheDocument();
            expect(screen.getByText('Normal Item')).toBeInTheDocument();
        });
    });

    it('handles fetch error gracefully', async () => {
        api.get.mockRejectedValue(new Error('API Error'));
        render(<Dashboard />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to load dashboard data');
        });
    });

    it('filters low stock items', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<Dashboard />);

        await waitFor(() => screen.getByText('Normal Item'));

        // Click Low Stock filter
        fireEvent.click(screen.getByText('Low Stock'));

        expect(screen.getByText('Low Stock Item')).toBeInTheDocument();
        expect(screen.queryByText('Normal Item')).not.toBeInTheDocument();

        // Switch back to All Items
        fireEvent.click(screen.getByText('All Items'));
        expect(screen.getByText('Normal Item')).toBeInTheDocument();
    });

    it('handles restock success', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        api.post.mockResolvedValue({});

        render(<Dashboard />);
        await waitFor(() => screen.getByText('Low Stock Item'));

        // Find restock button (first one)
        const restockBtns = screen.getAllByTitle('Quick Restock (+20)');
        fireEvent.click(restockBtns[0]);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/sweets/1/restock', { quantity: 20 });
            expect(toast.success).toHaveBeenCalledWith('Restocked successfully (+20)');
            expect(api.get).toHaveBeenCalledTimes(2); // Initial load + refresh
        });
    });

    it('handles restock error', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        api.post.mockRejectedValue(new Error('Restock Failed'));

        render(<Dashboard />);
        await waitFor(() => screen.getByText('Low Stock Item'));

        const restockBtns = screen.getAllByTitle('Quick Restock (+20)');
        fireEvent.click(restockBtns[0]);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to restock');
        });
    });

    it('handles delete flow success', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        api.delete.mockResolvedValue({});

        render(<Dashboard />);
        await waitFor(() => screen.getByText('Low Stock Item'));

        // Click delete on first item
        const deleteBtns = screen.getAllByTitle('Delete Product');
        fireEvent.click(deleteBtns[0]);

        // Verify Modal opens
        expect(screen.getByTestId('delete-modal')).toBeVisible();
        expect(screen.getByText('Deleting: Low Stock Item')).toBeInTheDocument();

        // Confirm delete
        fireEvent.click(screen.getByText('Confirm Delete'));

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/sweets/1');
            expect(toast.success).toHaveBeenCalledWith('Product deleted successfully');
            expect(api.get).toHaveBeenCalledTimes(2);
            expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
        });
    });

    it('handles delete failure', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        api.delete.mockRejectedValue(new Error('Delete Failed'));

        render(<Dashboard />);
        await waitFor(() => screen.getByText('Low Stock Item'));

        const deleteBtns = screen.getAllByTitle('Delete Product');
        fireEvent.click(deleteBtns[0]);
        fireEvent.click(screen.getByText('Confirm Delete'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to delete product');
            // Modal should still be open or close? Implementation setsDeletingSweet(null) on success only?
            // Checking implementation: setDeletingSweet(null) is ONLY in success block. 
            // So on error, modal stays open? Actually no, typically we might want to close it or keep it open to retry.
            // Let's check code: Yes, setDeletingSweet(null) is inside try block after success. So on error it stays open.
            // But let's just check toast for now.
        });
    });

    it('handles edit flow', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<Dashboard />);
        await waitFor(() => screen.getByText('Low Stock Item'));

        const editBtns = screen.getAllByTitle('Edit Product');
        fireEvent.click(editBtns[0]);

        expect(screen.getByTestId('add-modal')).toBeVisible();
        expect(screen.getByText('Edit: Low Stock Item')).toBeInTheDocument();

        // Simulate success callback from modal
        fireEvent.click(screen.getByText('Success'));
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledTimes(2);
        });
    });

    it('opens add modal', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<Dashboard />);
        await waitFor(() => screen.findByText('Dashboard'));

        fireEvent.click(screen.getByText('Add Product'));
        expect(screen.getByText('Add Mode')).toBeInTheDocument();
    });
});
