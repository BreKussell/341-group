const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/login', (req, res) => res.render('login'));
router.post('/login', accountController.login);
router.get('/logout', accountController.logout);  

module.exports = router;