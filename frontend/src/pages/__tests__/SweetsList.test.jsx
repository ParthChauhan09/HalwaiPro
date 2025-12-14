import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SweetsList from '../SweetsList';
import api from '../../utils/api';
import toast from 'react-hot-toast';

vi.mock('../../utils/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

describe('SweetsList Component', () => {
    const mockSweets = [
        { _id: '1', name: 'Gulab Jamun', description: 'desc', price: 50, stockQuantity: 10, category: 'Milk Based', imageUrl: 'test.jpg' },
        { _id: '2', name: 'Kaju Katli', description: 'desc', price: 600, stockQuantity: 0, category: 'Milk Based', imageUrl: 'kaju.jpg' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders and fetches sweets', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<SweetsList />);

        expect(screen.getByRole('heading', { name: /our delicious sweets/i })).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Gulab Jamun')).toBeInTheDocument();
            expect(screen.getByText('Out of Stock')).toBeInTheDocument(); // For item 2
        });
    });

    it('handles fetch error', async () => {
        api.get.mockRejectedValue(new Error('Fetch Error'));
        render(<SweetsList />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to load sweets');
        });
    });

    it('handles empty state', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<SweetsList />);

        await waitFor(() => {
            expect(screen.getByText('No sweets found matching your criteria.')).toBeInTheDocument();
        });

        // Test Clear Filters
        const clearBtn = screen.getByText('Clear all filters');
        fireEvent.click(clearBtn);
        expect(api.get).toHaveBeenCalledTimes(2);
    });

    it('search and filters work', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<SweetsList />);
        await waitFor(() => screen.getByText('Gulab Jamun'));

        const nameInput = screen.getByPlaceholderText('e.g. Gulab Jamun');
        fireEvent.change(nameInput, { target: { value: 'Gulab' } });

        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/sweets/search', expect.objectContaining({
                params: expect.objectContaining({ name: 'Gulab' })
            }));
        });
    });

    it('reset button clears filters', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<SweetsList />);
        await waitFor(() => screen.getByText('Gulab Jamun'));

        const nameInput = screen.getByPlaceholderText('e.g. Gulab Jamun');
        fireEvent.change(nameInput, { target: { value: 'Gulab' } });

        fireEvent.click(screen.getByText('Reset'));

        expect(nameInput.value).toBe('');
        // Should fetch with empty params
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/sweets/search', { params: {} });
        });
    });

    it('handles purchase success', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        api.post.mockResolvedValue({}); // Purchase success

        render(<SweetsList />);
        await waitFor(() => screen.getByText('Gulab Jamun'));

        // Purchase first item (stock 10)
        const purchaseBtn = screen.getByText('Purchase');
        fireEvent.click(purchaseBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/sweets/1/purchase', { quantity: 1 });
            expect(toast.success).toHaveBeenCalledWith('Purchase successful!');

            // Optimistic update check: Stock should reflect decrement if implemented.
            // The component does `setSweets` to decrement stock.
            // Since we mocked initial state as 10, checking UI might be tricky as we didn't re-render with new props, 
            // but the state update inside component should trigger re-render showing 9?
            // Actually `screen` queries query the DOM, so yes.
            // But we need to make sure the state is functional.
            expect(screen.getByText('9')).toBeInTheDocument();
        });
    });

    it('handles purchase failure', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        api.post.mockRejectedValue({ response: { data: { message: 'Stock unavailable' } } });

        render(<SweetsList />);
        await waitFor(() => screen.getByText('Gulab Jamun'));

        const purchaseBtn = screen.getByText('Purchase');
        fireEvent.click(purchaseBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Stock unavailable');
        });
    });
});
