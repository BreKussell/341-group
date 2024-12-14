import { Request, Response } from 'express';
import { getDb } from '../db/connect'; // MongoDB connection module
import bcrypt from 'bcrypt'; // For hashing passwords (optional but recommended)

// Handle user login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const db = getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username });

        if (user) {
            // Compare the entered password with the stored hash
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.user = { username: user.username }; // Save user session
                res.redirect('/planner/dashboard'); // Redirect to the dashboard
                return;
            }
        }

        res.status(401).render('login', { message: 'Get thee hense hacker!' }); // Render login with error
    } catch (error) {
        console.error(error);
        res.status(500).render('login', { message: 'An error occurred. Please try again.' });
    }
};

// Handle user registration
export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const saltRounds = 10; // Number of rounds to salt
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        const db = getDb();
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
export const logout = (req: Request, res: Response): void => {
    req.session.destroy(() => {
        res.redirect('/'); // Redirect to login page
    });
};