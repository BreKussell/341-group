import mongoose, { Mongoose, Model } from 'mongoose';
import dbConfig from '../config/db.config';

// Define the database object interface
interface Database {
    mongoose: Mongoose;
    url: string;
    cards: Model<any>;
}

// Ensure `dbConfig.url` is defined, or throw an error
if (!dbConfig.url) {
    throw new Error('Database URL is not defined in the configuration.');
}

// Configure mongoose
mongoose.Promise = global.Promise;

const db: Database = {
    mongoose: mongoose,
    url: dbConfig.url, // At this point, `dbConfig.url` is guaranteed to be a string
    cards: require('./cards')(mongoose), // Assuming './cards' exports a Mongoose model factory
};

export default db; // Export the database object
