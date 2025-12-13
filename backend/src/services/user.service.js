import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import config from '../config/env.js';

class UserService {
    async register(userData) {
        const { name, email, password, role } = userData;

        // If user already exists
        const userExists = await userRepository.existsByEmail(email);
        if (userExists) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Create user
        const user = await userRepository.create({
            name,
            email,
            password,
            role
        });

        // Generate token
        const token = this.generateToken(user._id);

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        };
    }

    async login(email, password) {
        // Find user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const userWithPassword = await userRepository.findUserForLogin(email);
        if (!userWithPassword) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await userWithPassword.matchPassword(password);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = this.generateToken(userWithPassword._id);

        return {
            user: {
                _id: userWithPassword._id,
                name: userWithPassword.name,
                email: userWithPassword.email,
                role: userWithPassword.role
            },
            token
        };
    }

    generateToken(id) {
        return jwt.sign({ id }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });
    }
}

export default new UserService();
