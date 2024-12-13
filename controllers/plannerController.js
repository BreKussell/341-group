const plannerModel = require('../models/plannerModel'); // Import the planner model

// Display the dashboard with goals
exports.dashboard = (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    const goals = plannerModel.getGoals(req.session.user.username) || {}; // Retrieve user goals
    res.status(200).render('dashboard', { goals }); // Render the dashboard with goals
};

// Add a new goal
exports.addGoal = (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    const { day, type, text } = req.body; // Extract goal details
    plannerModel.addGoal(req.session.user.username, day, type, text); // Add the goal
    res.redirect('/planner/dashboard'); // Redirect to dashboard
};

// Update an existing goal
exports.updateGoal = (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    const { currentGoal, newDay, newText } = req.body; // Extract goal update details
    plannerModel.updateGoal(req.session.user.username, currentGoal, newDay, newText); // Update the goal
    res.redirect('/planner/dashboard'); // Redirect to dashboard
};

// Get goals for the update page
exports.getGoalsForUpdate = (req) => {
    if (req.session.user && req.session.user.username) { // Ensure user is authenticated
        return plannerModel.getGoals(req.session.user.username); // Retrieve goals
    }
    return {}; // Return empty object if unauthenticated
};

// Delete a goal
exports.deleteGoal = (req, res) => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        return res.redirect('/account/login'); // Redirect to login if not authenticated
    }
    const { goalText, day } = req.body; // Extract goal details for deletion
    plannerModel.deleteGoal(req.session.user.username, day, goalText); // Delete the goal
    res.redirect('/planner/dashboard'); // Redirect to dashboard
};
