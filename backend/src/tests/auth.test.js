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

        it('should fail with invalid email format', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'password123',
                    role: 'customer'
                });

            expect(res.statusCode).toBe(500);
        });

        it('should fail with short password', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'shortpass@example.com',
                    password: '123',
                    role: 'customer'
                });

            expect(res.statusCode).toBe(500);
        });

        it('should assign default role if not specified', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Default Role User',
                    email: 'defaultrole@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user).toHaveProperty('role', 'staff');
        });
    });
    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            // First register a user
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Login User',
                    email: 'login@example.com',
                    password: 'password123',
                    role: 'customer'
                });

            // Then login
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'login@example.com');
        });

        it('should fail with invalid password', async () => {
            // First register a user
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Login User 2',
                    email: 'login2@example.com',
                    password: 'password123',
                    role: 'customer'
                });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login2@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });

        it('should fail with non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });
});
