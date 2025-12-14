import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../Dashboard';
import api from '../../utils/api';

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

// Mock child components to simplify testing
vi.mock('../../components/sweets/AddSweetModal', () => ({
    default: ({ isOpen, onClose, sweetToEdit }) => isOpen ? (
        <div data-testid="add-modal">
            {sweetToEdit ? 'Edit Mode' : 'Add Mode'}
            <button onClick={onClose}>Close</button>
        </div>
    ) : null
}));

vi.mock('../../components/common/DeleteConfirmationModal', () => ({
    default: ({ isOpen, onConfirm }) => isOpen ? (
        <div data-testid="delete-modal">
            Confirm Delete
            <button onClick={onConfirm}>Delete</button>
        </div>
    ) : null
}));

describe('Dashboard Component', () => {
    const mockSweets = [
        { _id: '1', name: 'Low Stock Item', price: 100, stockQuantity: 5, category: 'Milk' },
        { _id: '2', name: 'Normal Item', price: 200, stockQuantity: 50, category: 'Milk' }
    ];

    it('renders stats correctly', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Total Products')).toBeInTheDocument();

            // Stats might be duplicated (Total=2, Active=2)
            const twos = screen.getAllByText('2');
            expect(twos.length).toBeGreaterThanOrEqual(1);

            // Low Stock: 1
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });

    it('opens add modal on button click', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<Dashboard />);
        await waitFor(() => screen.findByText('Dashboard'));

        fireEvent.click(screen.getByText('Add Product'));
        expect(screen.getByTestId('add-modal')).toBeVisible();
        expect(screen.getByText('Add Mode')).toBeInTheDocument();
    });
});
