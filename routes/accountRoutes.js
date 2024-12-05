const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const accountController = require('../controllers/accountController'); // Import account controller

// Route to render login page
router.get('/login', (req, res) => res.render('login'));

// Route to handle login form submission
router.post('/login', accountController.login);

// Route to render registration page
router.get('/register', (req, res) => res.render('register'));

// Route to handle registration form submission
router.post('/register', accountController.register);

// Route to handle user logout
router.get('/logout', accountController.logout);

module.exports = router; // Export the router

