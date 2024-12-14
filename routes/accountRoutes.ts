import express, { Router, Request, Response } from 'express'; // Import Express framework and types
import { login, register, logout } from '../controllers/accountController'; // Import account controller methods

const router: Router = express.Router(); // Create a router object

// Route to render login page
router.get('/login', (req: Request, res: Response) => res.render('login'));

// Route to handle login form submission
router.post('/login', login);

// Route to render registration page
router.get('/register', (req: Request, res: Response) => res.render('register'));

// Route to handle registration form submission
router.post('/register', register);

// Route to handle user logout
router.get('/logout', logout);

export default router; // Export the router as default
