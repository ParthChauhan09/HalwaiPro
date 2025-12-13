import { jest } from '@jest/globals';

// Mock the service
const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
};

await jest.unstable_mockModule('../services/user.service.js', () => ({
    default: mockUserService
}));

const { default: authController } = await import('../controllers/auth.controller.js');

describe('Auth Controller Unit Tests (Error Handling)', () => {
    let req, res;
    let consoleErrorSpy;

    beforeEach(() => {
        req = {
            body: {}
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

    it('register should return 500 on service error', async () => {
        // Bypass validation by mocking, or relying on validation being inside controller?
        // Controller checks fields first. We need to pass validation to hit service.
        req.body = { name: 'Test', email: 'test@test.com', password: 'password', role: 'customer' };
        mockUserService.register.mockRejectedValue(new Error('Service Error'));

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Service Error' });
    });

    it('login should return 500 on service error', async () => {
        req.body = { email: 'test@test.com', password: 'password' };
        mockUserService.login.mockRejectedValue(new Error('Service Error'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Service Error' });
    });
});
