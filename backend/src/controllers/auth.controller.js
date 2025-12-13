import userService from '../services/user.service.js';

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            // Basic validation
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const result = await userService.register({ name, email, password, role });

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const result = await userService.login(email, password);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
