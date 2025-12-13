import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.database.mongoUri, {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
        })
        console.log('MongoDB Connected: ', conn.connection.host)

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


// Successfully connected
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

// Connection throws an error
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected from MongoDB");
});

// Graceful shutdown (Ctrl + C, server restart, etc.)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectDB;