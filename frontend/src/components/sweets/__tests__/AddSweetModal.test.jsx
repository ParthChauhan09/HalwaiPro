import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddSweetModal from '../AddSweetModal';
import api from '../../../utils/api';

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

    it('renders correctly when open', () => {
        render(<AddSweetModal {...defaultProps} />);
        expect(screen.getByText('Add New Sweet')).toBeInTheDocument();
        // We can now use label text or placeholder
        expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<AddSweetModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Add New Sweet')).not.toBeInTheDocument();
    });

    it('validates and submits form data', async () => {
        api.post.mockResolvedValue({});
        render(<AddSweetModal {...defaultProps} />);

        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Test Sweet' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByLabelText('Price (₹)'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Initial Stock'), { target: { value: '50' } });

        fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'http://img.com/1.jpg' } });

        const submitBtn = screen.getByText('Add Product');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/sweets', expect.objectContaining({
                name: 'Test Sweet',
                price: 100,
                stockQuantity: 50
            }));
            expect(defaultProps.onSuccess).toHaveBeenCalled();
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });

    it('populates form in edit mode', () => {
        const sweet = {
            _id: '123',
            name: 'Old Sweet',
            description: 'Old Desc',
            price: 200,
            stockQuantity: 20,
            category: 'Milk Based',
            imageUrl: 'img.jpg'
        };
        render(<AddSweetModal {...defaultProps} sweetToEdit={sweet} />);

        expect(screen.getByText('Edit Sweet')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Old Sweet')).toBeInTheDocument();
        expect(screen.getByText('Update Product')).toBeInTheDocument();
    });
});
