import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db | null = null; // Store the database instance, initially null

// Function to connect to the database
export const connectDb = async (): Promise<void> => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('MongoDB connected');
        db = client.db('TeamAssignment'); // Use your database name here
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err; // Rethrow the error to stop the process
    }
};

// Get the db instance
export const getDb = (): Db => {
    if (!db) {
        throw new Error('Db not initialized');
    }
    return db;
};
