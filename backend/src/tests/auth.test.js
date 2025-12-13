import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import config from '../config/env.js';

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        // Distinct database for testing
        const testUri = config.database.mongoUri.replace(/\/[^/]+$/, '/halwaipro_test');
        await mongoose.connect(testUri);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'customer'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should fail if email is missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    password: 'password123',
                    role: 'customer'
                });

            expect(res.statusCode).toBe(400);
        });

        it('should fail if email is already registered', async () => {
            // First register
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'duplicate@example.com',
                    password: 'password123',
                    role: 'customer'
                });

            // Try again
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User 2',
                    email: 'duplicate@example.com',
                    password: 'password123',
                    role: 'customer'
                });

            expect(res.statusCode).toBe(409);
        });
    });
});
