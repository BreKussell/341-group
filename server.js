const express = require('express');
const bodyParser = require('body-parser');
const accountRoutes = require('./routes/accountRoutes');
const port = 3000


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.set('view engine', 'ejs');


// Root route to send users to the login page with a default empty message
app.get('/', (req, res) => res.render('login', { message: '' }));

// Routes
app.use('/account', accountRoutes);


// Error handling
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${port}`);
});