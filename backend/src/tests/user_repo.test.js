import mongoose from 'mongoose';
import userRepository from '../repositories/user.repository.js';
import config from '../config/env.js';

describe('User Repository Generic Methods', () => {
    beforeAll(async () => {
        const testUri = config.database.mongoUri.replace(/\/[^/]+$/, '/halwaipro_test_users_repo');
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(testUri);
        } else {
            await mongoose.disconnect();
            await mongoose.connect(testUri);
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should create and find a user by ID', async () => {
        const user = await userRepository.create({
            name: 'Repo Test User',
            email: 'repo@test.com',
            password: 'password123',
            role: 'staff'
        });
        expect(user).toHaveProperty('_id');

        const foundUser = await userRepository.findById(user._id);
        expect(foundUser).toBeTruthy();
        expect(foundUser._id.toString()).toBe(user._id.toString());
    });

    it('should find all users', async () => {
        const users = await userRepository.findAll();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);
    });

    it('should update a user', async () => {
        const user = await userRepository.create({
            name: 'To Update',
            email: 'update@test.com',
            password: 'password123'
        });

        const updated = await userRepository.update(user._id, { name: 'Updated Name' });
        expect(updated.name).toBe('Updated Name');
    });

    it('should delete a user', async () => {
        const user = await userRepository.create({
            name: 'To Delete',
            email: 'delete@test.com',
            password: 'password123'
        });

        const deleted = await userRepository.delete(user._id);
        expect(deleted).toBeTruthy();

        const found = await userRepository.findById(user._id);
        expect(found).toBeNull();
    });
});
