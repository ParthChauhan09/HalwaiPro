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
    let req, res;
    let consoleErrorSpy;

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
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('createSweet should return 500 on service error', async () => {
        req.body = { name: 'Test', price: 10, description: 'Desc', category: 'Cat', imageUrl: 'Img' };
        mockSweetService.createSweet.mockRejectedValue(new Error('Service Error'));

        await sweetController.createSweet(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Service Error' });
    });

    it('getAllSweets should return 500 on service error', async () => {
        mockSweetService.getAllSweets.mockRejectedValue(new Error('Service Error'));
        await sweetController.getAllSweets(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('getSweetById should return 500 on service error', async () => {
        req.params.id = '123';
        mockSweetService.getSweetById.mockRejectedValue(new Error('Service Error'));
        await sweetController.getSweetById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('searchSweets should return 500 on service error', async () => {
        mockSweetService.searchSweets.mockRejectedValue(new Error('Service Error'));
        await sweetController.searchSweets(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('updateSweet should return 500 on service error', async () => {
        req.params.id = '123';
        mockSweetService.updateSweet.mockRejectedValue(new Error('Service Error'));
        await sweetController.updateSweet(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('deleteSweet should return 500 on service error', async () => {
        req.params.id = '123';
        mockSweetService.deleteSweet.mockRejectedValue(new Error('Service Error'));
        await sweetController.deleteSweet(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('purchaseSweet should return 500 on service error', async () => {
        req.params.id = '123';
        req.body.quantity = 1;
        mockSweetService.purchaseSweet.mockRejectedValue(new Error('Service Error'));
        await sweetController.purchaseSweet(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('restockSweet should return 500 on service error', async () => {
        req.params.id = '123';
        req.body.quantity = 1;
        mockSweetService.restockSweet.mockRejectedValue(new Error('Service Error'));
        await sweetController.restockSweet(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
