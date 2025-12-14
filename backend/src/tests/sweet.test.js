import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import config from '../config/env.js';
import User from '../models/User.js';

describe('Sweet Endpoints', () => {
    let adminToken;
    let staffToken;
    let customerToken;
    let sweetId;

    beforeAll(async () => {
        // Distinct database for testing
        const testUri = config.database.mongoUri.replace(/\/[^/]+$/, '/halwaipro_test_sweets_full');
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(testUri);
        } else {
            await mongoose.disconnect();
            await mongoose.connect(testUri);
        }

        // Register Admin
        // Register Admin - Create directly in DB to ensure admin role
        await User.create({
            name: 'Sweet Admin',
            email: 'admin@sweets.com',
            password: 'password123',
            role: 'admin'
        });
        const adminLogin = await request(app).post('/api/auth/login').send({
            email: 'admin@sweets.com',
            password: 'password123'
        });
        adminToken = adminLogin.body.token;

        // Register Staff
        await request(app).post('/api/auth/register').send({
            name: 'Sweet Staff',
            email: 'staff@sweets.com',
            password: 'password123',
            role: 'staff'
        });
        const staffLogin = await request(app).post('/api/auth/login').send({
            email: 'staff@sweets.com',
            password: 'password123'
        });
        staffToken = staffLogin.body.token;


    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/sweets', () => {
        it('should create a sweet successfully (Admin)', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Gulab Jamun',
                    price: 50,
                    description: 'Soft and juicy milk solids balls',
                    category: 'Milk Based',
                    imageUrl: 'http://example.com/gulabjamun.jpg',
                    stockQuantity: 100,
                    isAvailable: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            sweetId = res.body._id; // Save for later tests
        });

        it('should create a sweet successfully (Staff)', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${staffToken}`)
                .send({
                    name: 'Kaju Katli',
                    price: 800,
                    description: 'Diamond shaped cashew fudge',
                    category: 'Milk Based',
                    imageUrl: 'http://example.com/kaju.jpg'
                });

            expect(res.statusCode).toBe(201);
        });



        it('should fail if fields are missing', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Incomplete Sweet'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/sweets', () => {
        it('should get all sweets', async () => {
            const res = await request(app).get('/api/sweets');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        it('should get sweet by ID', async () => {
            const res = await request(app).get(`/api/sweets/${sweetId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('name', 'Gulab Jamun');
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should update sweet (Admin)', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    price: 60
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('price', 60);
        });
    });

    describe('Inventory Operations', () => {
        it('should allow staff to purchase sweet', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${staffToken}`)
                .send({ quantity: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.stockQuantity).toBe(95); // 100 - 5
        });

        it('should fail purchase if insufficient stock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${staffToken}`)
                .send({ quantity: 1000 });

            expect(res.statusCode).toBe(400); // Bad Request
        });

        it('should allow Admin to restock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 50 });

            expect(res.statusCode).toBe(200);
            expect(res.body.stockQuantity).toBe(145); // 95 + 50
        });


    });

    describe('Search Sweets', () => {
        it('should search by name', async () => {
            const res = await request(app)
                .get('/api/sweets/search')
                .query({ name: 'Gulab' });

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].name).toContain('Gulab');
        });
    });

    describe('Edge Cases & Error Handling', () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const invalidId = 'invalid-id-format';

        it('should return 404 when getting non-existent sweet', async () => {
            const res = await request(app).get(`/api/sweets/${nonExistentId}`);
            expect(res.statusCode).toBe(404);
        });

        it('should return 404 when updating non-existent sweet', async () => {
            const res = await request(app)
                .put(`/api/sweets/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 100 });
            expect(res.statusCode).toBe(404);
        });

        it('should return 404 when deleting non-existent sweet', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(404);
        });

        it('should return 404 when purchasing non-existent sweet', async () => {
            const res = await request(app)
                .post(`/api/sweets/${nonExistentId}/purchase`)
                .set('Authorization', `Bearer ${staffToken}`)
                .send({ quantity: 1 });
            expect(res.statusCode).toBe(404);
        });

        it('should return 404 when restocking non-existent sweet', async () => {
            const res = await request(app)
                .post(`/api/sweets/${nonExistentId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 10 });
            expect(res.statusCode).toBe(404);
        });

        // Invalid ID format tests (Expect 404 due to CastError handled in middleware)
        it('should handle invalid ID format gracefully (Get)', async () => {
            const res = await request(app).get(`/api/sweets/${invalidId}`);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('Advanced Search', () => {
        it('should search by category', async () => {
            const res = await request(app)
                .get('/api/sweets/search')
                .query({ category: 'Milk Based' });
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should filter by price range', async () => {
            const res = await request(app)
                .get('/api/sweets/search')
                .query({ minPrice: 10, maxPrice: 1000 });
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return all if no query params', async () => {
            const res = await request(app).get('/api/sweets/search');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        it('should fail delete if Staff (Forbidden)', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${staffToken}`);

            expect(res.statusCode).toBe(403);
        });

        it('should delete sweet (Admin)', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
        });
    });
});
