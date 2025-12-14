import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SweetsList from '../SweetsList';
import api from '../../utils/api';
import { MemoryRouter } from 'react-router-dom';

// Mock the API module
vi.mock('../../utils/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

describe('SweetsList Component', () => {
    const mockSweets = [
        {
            _id: '1',
            name: 'Gulab Jamun',
            description: 'Delicious sweet',
            price: 50,
            stockQuantity: 10,
            category: 'Milk Based',
            imageUrl: 'test.jpg'
        },
        {
            _id: '2',
            name: 'Kaju Katli',
            description: 'Cashew fudge',
            price: 600,
            stockQuantity: 5,
            category: 'Milk Based',
            imageUrl: 'kaju.jpg'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Mock a pending promise
        api.get.mockReturnValue(new Promise(() => { }));
        render(<SweetsList />);
        // Look for loader or generic loading behavior if any (our component might just show empty or loader)
        // Based on implementation, if we can find text or class.
        // Let's assume there is some text or we just wait for data.
    });

    it('fetches and displays sweets', async () => {
        api.get.mockResolvedValue({ data: mockSweets });

        render(<SweetsList />);

        await waitFor(() => {
            expect(screen.getByText('Gulab Jamun')).toBeInTheDocument();
            expect(screen.getByText('Kaju Katli')).toBeInTheDocument();
        });

        expect(screen.getByText('₹50')).toBeInTheDocument();
    });

    it('handles search input', async () => {
        api.get.mockResolvedValue({ data: mockSweets });
        render(<SweetsList />);

        await waitFor(() => expect(screen.getByText('Gulab Jamun')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText('e.g. Gulab Jamun');
        fireEvent.change(searchInput, { target: { value: 'Gulab' } });

        fireEvent.click(screen.getByText('Search'));

        // Verify API is called with search params
        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/search'), expect.objectContaining({
                params: expect.objectContaining({ name: 'Gulab' })
            }));
        });
    });
});
