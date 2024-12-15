const { connectDb } = require('./db/connect');
require('dotenv').config(); // Load environment variables
const express = require('express'); // Import Express framework
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const session = require('express-session'); // Session management
const accountRoutes = require('./routes/accountRoutes'); // Account-related routes
const plannerRoutes = require('./routes/plannerRoutes'); // Planner-related routes

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3001; // Define the server port

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from the "public" folder

app.set('view engine', 'ejs'); // Set EJS as the template engine

// Configure session management with a session secret
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret', // Use environment variable or default secret
    resave: false, // Avoid resaving sessions unnecessarily
    saveUninitialized: true // Save uninitialized sessions
}));

// Root route to send users to the login page with a default empty message
app.get('/', (req, res) => res.render('login', { message: '' }));

// Routes for account and planner functionalities
app.use('/account', accountRoutes);
app.use('/planner', plannerRoutes);

// Error handling for 404 (Page Not Found)
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Error handling for server errors (500 Internal Server Error)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).send('500 - Server Error');
});

// Connect to the database and start the server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database connection:', err);
    process.exit(1); // Exit the process if the connection fails
  });
