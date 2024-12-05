const plannerModel = require('../models/plannerModel');

exports.dashboard = (req, res) => {
    if (!req.session.user || !req.session.user.username) {
        // Redirect to login if user is not authenticated
        return res.redirect('/account/login');
    }

    const goals = plannerModel.getGoals(req.session.user.username) || {};
    res.status(200).render('dashboard', { goals });
};

exports.addGoal = (req, res) => {
    if (!req.session.user || !req.session.user.username) {
        return res.redirect('/account/login');
    }

    const { day, type, text } = req.body;
    plannerModel.addGoal(req.session.user.username, day, type, text);
    res.redirect('/planner/dashboard');
};

exports.updateGoal = (req, res) => {
    if (!req.session.user || !req.session.user.username) {
        return res.redirect('/account/login');
    }

    const { currentGoal, newDay, newText } = req.body;
    plannerModel.updateGoal(req.session.user.username, currentGoal, newDay, newText);
    res.redirect('/planner/dashboard');
};

exports.getGoalsForUpdate = (req) => {
    if (req.session.user && req.session.user.username) {
        return plannerModel.getGoals(req.session.user.username);
    }
    return {};
};
