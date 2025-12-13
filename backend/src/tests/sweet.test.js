import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import config from '../config/env.js';

describe('Sweet Endpoints', () => {
    let token;

    beforeAll(async () => {
        // Distinct database for testing
        const testUri = config.database.mongoUri.replace(/\/[^/]+$/, '/halwaipro_test_sweets');
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(testUri);
        } else {
            await mongoose.disconnect();
            await mongoose.connect(testUri);
        }

        // Create a user to get token
        await request(app).post('/api/auth/register').send({
            name: 'Sweet Admin',
            email: 'admin@sweets.com',
            password: 'password123',
            role: 'admin'
        });

        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@sweets.com',
            password: 'password123'
        });

        token = loginRes.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/sweets', () => {
        it('should create a sweet successfully', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Gulab Jamun',
                    price: 50,
                    description: 'Soft and juicy milk solids balls',
                    category: 'Milk Based',
                    imageUrl: 'http://example.com/gulabjamun.jpg'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Gulab Jamun');
        });

        it('should fail if fields are missing', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Incomplete Sweet'
                    // Missing price, description etc.
                });

            expect(res.statusCode).toBe(400);
        });

        it('should fail if unauthorized (no token)', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .send({
                    name: 'Unauthorized Sweet',
                    price: 100
                });

            expect(res.statusCode).toBe(401);
        });
    });
});
