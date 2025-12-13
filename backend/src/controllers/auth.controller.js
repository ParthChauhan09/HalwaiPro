import userService from '../services/user.service.js';

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;

            // Basic validation
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const result = await userService.register({ name, email, password, role });

            res.status(201).json(result);
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('AUTH ERROR:', error);
            }
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }
}

export default new AuthController();
