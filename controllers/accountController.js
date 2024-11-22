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



// Logout function
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');  // Redirect to the root route, which renders login.ejs
    });
};