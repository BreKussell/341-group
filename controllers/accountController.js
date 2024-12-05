const fs = require('fs'); // File system module
const path = './data/data.json'; // Path to the JSON file storing user data

// Handle user login
exports.login = (req, res) => {
    const { username, password } = req.body; // Extract login credentials
    const data = JSON.parse(fs.readFileSync(path)); // Read and parse the JSON file
    const user = data.users.find(user => user.username === username); // Find user by username

    if (user && user.password === password) { // Verify credentials
        req.session.user = { username: user.username }; // Save user session
        return res.redirect('/planner/dashboard'); // Redirect to the dashboard
    }

    res.status(401).render('login', { message: 'Get Thee hense Hacker!' }); // Render login with error
};

// Handle user registration
exports.register = (req, res) => {
    const { username, password } = req.body; // Extract registration details
    const data = JSON.parse(fs.readFileSync(path)); // Read and parse the JSON file

    if (data.users.some(user => user.username === username)) { // Check for duplicate usernames
        return res.render('register', { message: 'Username already exists. Please choose another.' });
    }

    const newUser = { username, password, goals: {} }; // Create a new user object
    data.users.push(newUser); // Add the new user to the data
    fs.writeFileSync(path, JSON.stringify(data, null, 2)); // Save changes to the file

    res.status(201).render('login', { message: 'Registration successful! Log in.' }); // Redirect to login
};

// Handle user logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Redirect to login page
    });
};
