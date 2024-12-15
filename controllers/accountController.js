const mongodb = require('../db/connect'); // MongoDB connection module
const bcrypt = require('bcrypt'); // For hashing passwords (optional but recommended)

// Handle user login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username

        if (user) {
            // Compare the entered password with the stored hash
            const match = await bcrypt.compare(password, user.password);
            
            if (match) {
                req.session.user = { username: user.username }; // Save user session
                return res.redirect('/planner/dashboard'); // Redirect to the dashboard
            }
        }

        res.status(401).render('login', { message: 'get thee hense hacker!.' }); // Render login with error
    } catch (error) {
        console.error(error);
        res.status(500).render('login', { message: 'An error occurred. Please try again.' });
    }
};

// Handle user registration
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const saltRounds = 10; // Number of rounds to salt
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password
        
        const db = mongodb.getDb();
        const newUser = {
            username,
            password: hashedPassword, // Store the hashed password
        };
        
        await db.collection('users').insertOne(newUser); // Insert new user into the database
        
        res.status(200).render('login', { message: 'Registration successful! Please log in.' });
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