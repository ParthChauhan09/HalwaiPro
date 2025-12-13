import { jest } from '@jest/globals';

// Mock the service
const mockSweetService = {
    createSweet: jest.fn(),
    getAllSweets: jest.fn(),
    getSweetById: jest.fn(),
    searchSweets: jest.fn(),
    updateSweet: jest.fn(),
    deleteSweet: jest.fn(),
    purchaseSweet: jest.fn(),
    restockSweet: jest.fn(),
};

await jest.unstable_mockModule('../services/sweet.service.js', () => ({
    default: mockSweetService
}));

const { default: sweetController } = await import('../controllers/sweet.controller.js');

describe('Sweet Controller Unit Tests (Error Handling)', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('createSweet should call next(error) on service error', async () => {
        req.body = { name: 'Test', price: 10, description: 'Desc', category: 'Cat', imageUrl: 'Img' };
        const error = new Error('Service Error');
        mockSweetService.createSweet.mockRejectedValue(error);

        await sweetController.createSweet(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('getAllSweets should call next(error) on service error', async () => {
        const error = new Error('Service Error');
        mockSweetService.getAllSweets.mockRejectedValue(error);
        await sweetController.getAllSweets(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('getSweetById should call next(error) on service error', async () => {
        req.params.id = '123';
        const error = new Error('Service Error');
        mockSweetService.getSweetById.mockRejectedValue(error);
        await sweetController.getSweetById(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('searchSweets should call next(error) on service error', async () => {
        const error = new Error('Service Error');
        mockSweetService.searchSweets.mockRejectedValue(error);
        await sweetController.searchSweets(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('updateSweet should call next(error) on service error', async () => {
        req.params.id = '123';
        const error = new Error('Service Error');
        mockSweetService.updateSweet.mockRejectedValue(error);
        await sweetController.updateSweet(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('deleteSweet should call next(error) on service error', async () => {
        req.params.id = '123';
        const error = new Error('Service Error');
        mockSweetService.deleteSweet.mockRejectedValue(error);
        await sweetController.deleteSweet(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('purchaseSweet should call next(error) on service error', async () => {
        req.params.id = '123';
        req.body.quantity = 1;
        const error = new Error('Service Error');
        mockSweetService.purchaseSweet.mockRejectedValue(error);
        await sweetController.purchaseSweet(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('restockSweet should call next(error) on service error', async () => {
        req.params.id = '123';
        req.body.quantity = 1;
        const error = new Error('Service Error');
        mockSweetService.restockSweet.mockRejectedValue(error);
        await sweetController.restockSweet(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });
});
