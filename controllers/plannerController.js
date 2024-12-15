const plannerModel = require('../models/plannerModel'); // Import the planner model

// Display the dashboard with goals
exports.dashboard = async (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    try {
        const goals = await plannerModel.getGoals(req.session.user.username); // Await the async call
        res.status(200).render('dashboard', { goals }); // Render the dashboard with goals
    } catch (error) {
        console.error('Error displaying dashboard:', error); // Log errors
        res.status(500).send('Internal Server Error');
    }
};

// Add a new goal
exports.addGoal = async (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    const { day, type, text } = req.body; // Extract goal details
    try {
        await plannerModel.addGoal(req.session.user.username, day, type, text); // Add the goal
        res.redirect('/planner/dashboard'); // Redirect to dashboard
    } catch (error) {
        console.error('Error adding goal:', error); // Log errors
        res.status(500).send('Internal Server Error');
    }
};

// Update an existing goal
exports.updateGoal = async (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    const { currentGoal, newDay, newText } = req.body; // Extract goal update details
    try {
        await plannerModel.updateGoal(req.session.user.username, currentGoal, newDay, newText); // Update the goal
        res.redirect('/planner/dashboard'); // Redirect to dashboard
    } catch (error) {
        console.error('Error updating goal:', error); // Log errors
        res.status(500).send('Internal Server Error');
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    const { goalText, day } = req.body; // Extract goal details for deletion
    try {
        await plannerModel.deleteGoal(req.session.user.username, day, goalText); // Delete the goal
        res.redirect('/planner/dashboard'); // Redirect to dashboard
    } catch (error) {
        console.error('Error deleting goal:', error); // Log errors
        res.status(500).send('Internal Server Error');
    }
};