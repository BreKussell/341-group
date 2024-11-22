const fs = require('fs');
const path = './data/data.json';

// Login function
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(path));

    // Find the user by username
    const user = data.users.find(user => user.username === username);

    // Directly compare plain text password
    if (user && user.password === password) {
        req.session.user = { username: user.username };


        // Pass user data to the dashboard view
        return res.status(200).render('dashboard', { message: `Welcome ${username}!` });
    }

    // If user not found or password doesn't match
    res.status(401).render('login', { message: 'Get thee hense Hacker!' });
};

// Register function 
exports.register = (req, res) => {
    const { username, password } = req.body;

    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(path));

    // Check if username already exists
    const userExists = data.users.some(user => user.username === username);
    if (userExists) {
        return res.render('register', { message: 'Username already exists. Please choose another.' });
    }

    // Add the new user to the 'users' array with plain-text password
    const newUser = { username, password };
    data.users.push(newUser);

    
    // Write the updated data back to the JSON file
    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    // Redirect to login page with a success message
    res.status(201).render('login', { message: 'Registration successful! Log in.' });
};

// Logout function
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');  // Redirect to the root route, which renders login.ejs
    });
};