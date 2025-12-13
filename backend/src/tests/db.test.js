import { jest } from '@jest/globals';

// Define the mock factory
const mockMongoose = {
    connect: jest.fn(),
    connection: {
        host: 'localhost',
        on: jest.fn(),
        close: jest.fn(),
    },
};

// unstable_mockModule must be called before dynamic import
await jest.unstable_mockModule('mongoose', () => ({
    default: mockMongoose,
    ...mockMongoose
}));

// Dynamic import of the module under test
const { default: connectDB } = await import('../config/db.js');
const { default: config } = await import('../config/env.js');

describe('DB Connection', () => {

    let consoleLogSpy, processExitSpy;

    beforeAll(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { });
        jest.spyOn(process, 'on').mockImplementation((_event, _callback) => {
            // No-op for SIGINT to prevent test exit
        });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockMongoose.connect.mockClear();
        mockMongoose.connection.on.mockClear();
        mockMongoose.connection.close.mockClear();
        consoleLogSpy.mockClear();
        processExitSpy.mockClear();
    });

    it('should connect successfully', async () => {
        mockMongoose.connect.mockResolvedValueOnce({ connection: { host: 'localhost' } });
        await connectDB();
        expect(mockMongoose.connect).toHaveBeenCalledWith(config.database.mongoUri, expect.any(Object));
        expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB Connected: ', 'localhost');

        // Verify event listeners were attached
        expect(mockMongoose.connection.on).toHaveBeenCalledWith('connected', expect.any(Function));
        expect(mockMongoose.connection.on).toHaveBeenCalledWith('error', expect.any(Function));
        expect(mockMongoose.connection.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
    });

    it('should handle connection failure', async () => {
        const error = new Error('Connection Failed');
        mockMongoose.connect.mockRejectedValueOnce(error);
        await connectDB();
        expect(consoleLogSpy).toHaveBeenCalledWith(error);
        expect(processExitSpy).toHaveBeenCalledWith(1);
    });
});
