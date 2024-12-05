const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const plannerController = require('../controllers/plannerController'); // Import planner controller

// Route to display the dashboard with goals
router.get('/dashboard', plannerController.dashboard);

// Route to render the addGoal page
router.get('/addGoal', (req, res) => res.render('addGoal'));

// Route to handle adding a new goal
router.post('/addGoal', plannerController.addGoal);

// Route to render the updateGoal page with existing goals
router.get('/updateGoal', (req, res) => res.render('updateGoal', { goals: plannerController.getGoalsForUpdate(req) }));

// Route to handle updating a goal
router.post('/updateGoal', plannerController.updateGoal);

module.exports = router; // Export the router
