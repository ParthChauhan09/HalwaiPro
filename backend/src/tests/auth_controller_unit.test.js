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
    let req, res, next;
    let consoleErrorSpy;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('register should call next(error) on service error', async () => {
        req.body = { name: 'Test', email: 'test@test.com', password: 'password', role: 'customer' };
        const error = new Error('Service Error');
        mockUserService.register.mockRejectedValue(error);

        await authController.register(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('login should call next(error) on service error', async () => {
        req.body = { email: 'test@test.com', password: 'password' };
        const error = new Error('Service Error');
        mockUserService.login.mockRejectedValue(error);

        await authController.login(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
