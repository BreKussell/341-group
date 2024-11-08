const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set view engine to ejs
app.set('view engine', 'ejs');

// Route to render login page
app.get('/', (req, res) => {
  res.render('login');
});

// Route to handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Temporary login credentials
  if (username === 'user1' && password === 'password') {
    return res.redirect('/dashboard');
  } else {
    return res.send('Invalid login credentials');
  }
});

// Route to render dashboard page (after successful login)
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
