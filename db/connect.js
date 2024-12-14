const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let db;  // Store the database instance

// Function to connect to the database
const connectDb = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('MongoDB connected');
    db = client.db('TeamAssignment');  // Use your database name here
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; // Rethrow the error to stop the process
  }
};

// Get the db instance
const getDb = () => {
  if (!db) {
    throw new Error('Db not initialized');
  }
  return db;
};

module.exports = { connectDb, getDb };