import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddSweetModal from '../AddSweetModal';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

vi.mock('../../../utils/api', () => ({
    default: {
        post: vi.fn(),
        put: vi.fn()
    }
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

describe('AddSweetModal Component', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        sweetToEdit: null
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<AddSweetModal {...defaultProps} />);
        expect(screen.getByText('Add New Sweet')).toBeInTheDocument();
    });

    it('submits successfully (Create)', async () => {
        api.post.mockResolvedValue({});
        render(<AddSweetModal {...defaultProps} />);

        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'New Sweet' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByLabelText('Price (₹)'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Initial Stock'), { target: { value: '20' } });
        fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'url.jpg' } });

        fireEvent.click(screen.getByText('Add Product'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/sweets', expect.objectContaining({ name: 'New Sweet' }));
            expect(toast.success).toHaveBeenCalledWith('Sweet added successfully!');
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });

    it('submits successfully (Update)', async () => {
        const sweet = { _id: '123', name: 'Old', description: 'D', price: 10, stockQuantity: 5, category: 'Milk Based', imageUrl: 'u.jpg' };
        api.put.mockResolvedValue({});

        render(<AddSweetModal {...defaultProps} sweetToEdit={sweet} />);

        expect(screen.getByText('Update Product')).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Updated' } });

        fireEvent.click(screen.getByText('Update Product'));

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith('/sweets/123', expect.objectContaining({ name: 'Updated' }));
            expect(toast.success).toHaveBeenCalledWith('Sweet updated successfully!');
        });
    });

    it('handles API error', async () => {
        api.post.mockRejectedValue({ response: { data: { message: 'Creation failed' } } });
        render(<AddSweetModal {...defaultProps} />);

        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Fail Sweet' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByLabelText('Price (₹)'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Initial Stock'), { target: { value: '20' } });
        fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'url.jpg' } });

        fireEvent.click(screen.getByText('Add Product'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Creation failed');
        });
    });

    it('handles default API error', async () => {
        api.post.mockRejectedValue(new Error('Network error'));
        render(<AddSweetModal {...defaultProps} />);

        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Fail Sweet' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByLabelText('Price (₹)'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Initial Stock'), { target: { value: '20' } });
        fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'url.jpg' } });

        fireEvent.click(screen.getByText('Add Product'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to save sweet');
        });
    });
});
