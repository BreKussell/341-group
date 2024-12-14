const mongodb = require('../db/connect'); // MongoDB connection module
const bcrypt = require('bcrypt'); // For hashing passwords (optional but recommended)

// Handle user login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username

        if (user && user.password === password) {
            req.session.user = { username: user.username }; // Save user session
            return res.redirect('/planner/dashboard'); // Redirect to the dashboard
        }

        res.status(401).render('login', { message: 'Get Thee hence, Hacker!' }); // Render login with error
    } catch (error) {
        console.error(error);
        res.status(500).render('login', { message: 'An error occurred. Please try again.' });
    }
};

// Handle user registration
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = mongodb.getDb(); // Get the database instance
        const userExists = await db.collection('users').findOne({ username }); // Check for duplicate usernames

        if (userExists) {
            return res.render('register', { message: 'Username already exists. Please choose another.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = { username, password: hashedPassword, goals: {} }; // Create a new user object
        await db.collection('users').insertOne(newUser); // Save the new user to the database

        res.status(201).render('login', { message: 'Registration successful! Log in.' }); // Redirect to login
    } catch (error) {
        console.error(error);
        res.status(500).render('register', { message: 'An error occurred. Please try again.' });
    }
};

// Handle user logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Redirect to login page
    });
};