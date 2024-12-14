import { connectDb } from './db/connect';
import dotenv from 'dotenv'; // Load environment variables
import express, { Application, Request, Response, NextFunction } from 'express'; // Import Express and types
import bodyParser from 'body-parser'; // Middleware for parsing request bodies
import session from 'express-session'; // Session management
import accountRoutes from './routes/accountRoutes'; // Account-related routes
import plannerRoutes from './routes/plannerRoutes'; // Planner-related routes

dotenv.config(); // Initialize environment variables

const app: Application = express(); // Initialize Express app
const PORT: number = parseInt(process.env.PORT || '3001', 10); // Define the server port

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from the "public" folder
app.set('view engine', 'ejs'); // Set EJS as the template engine

// Configure session management
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultSecret', // Use environment variable or default secret
        resave: false, // Avoid resaving sessions unnecessarily
        saveUninitialized: true, // Save uninitialized sessions
    })
);

// Root route to send users to the login page with a default empty message
app.get('/', (req: Request, res: Response) => res.render('login', { message: '' }));

// Routes for account and planner functionalities
app.use('/account', accountRoutes);
app.use('/planner', plannerRoutes);

// Error handling for 404 (Page Not Found)
app.use((req: Request, res: Response) => {
    res.status(404).send('404 - Page Not Found');
});

// Error handling for server errors (500 Internal Server Error)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error
    res.status(500).send('500 - Server Error');
});

// Start the server after the database connection is established
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err: Error) => {
        console.error('Failed to initialize database connection:', err);
        process.exit(1); // Exit the process if the connection fails
    });
