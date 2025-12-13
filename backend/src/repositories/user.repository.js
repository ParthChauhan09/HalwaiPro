import User from "../models/User.js";

class UserRepository {
    // New user
    async create(userData) {
        const user = await User.create(userData);
        return user;
    }

    // Find By Email
    async findByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

    // Find for login (include password)
    async findUserForLogin(email) {
        const user = await User.findOne({ email }).select('+password');
        return user;
    }

    // Finf by Id
    async findById(id) {
        const user = await User.findById(id);
        return user;
    }


    // Email exists
    async existsByEmail(email) {
        const count = await User.countDocuments({ email });
        return count > 0;
    }

    // All Users
    async findAll(filter = {}) {
        const users = (await User.find(filter)).sort({ createdAt: -1 });
        return users;
    }

    // Delete User
    async deleteById(id) {
        const user = await User.findByIdAndDelete(id);
        return user;
    }
}

export default new UserRepository();
