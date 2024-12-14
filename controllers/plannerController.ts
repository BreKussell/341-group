import { Request, Response } from 'express';
import plannerModel from '../models/plannerModel'; // Import the planner model

// Display the dashboard with goals
export const dashboard = (req: Request, res: Response): void => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        res.redirect('/account/login'); // Redirect to login if not authenticated
        return;
    }
    const goals = plannerModel.getGoals(req.session.user.username) || {}; // Retrieve user goals
    res.status(200).render('dashboard', { goals }); // Render the dashboard with goals
};

// Add a new goal
export const addGoal = (req: Request, res: Response): void => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        res.redirect('/account/login'); // Redirect to login if not authenticated
        return;
    }
    const { day, type, text } = req.body; // Extract goal details
    plannerModel.addGoal(req.session.user.username, day, type, text); // Add the goal
    res.redirect('/planner/dashboard'); // Redirect to dashboard
};

// Update an existing goal
export const updateGoal = (req: Request, res: Response): void => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        res.redirect('/account/login'); // Redirect to login if not authenticated
        return;
    }
    const { currentGoal, newDay, newText } = req.body; // Extract goal update details
    plannerModel.updateGoal(req.session.user.username, currentGoal, newDay, newText); // Update the goal
    res.redirect('/planner/dashboard'); // Redirect to dashboard
};

// Get goals for the update page
export const getGoalsForUpdate = (req: Request): Record<string, any> => {
    if (req.session.user && req.session.user.username) { // Ensure user is authenticated
        return plannerModel.getGoals(req.session.user.username); // Retrieve goals
    }
    return {}; // Return empty object if unauthenticated
};

// Delete a goal
export const deleteGoal = (req: Request, res: Response): void => {
    if (!req.session.user || !req.session.user.username) { // Ensure user is authenticated
        res.redirect('/account/login'); // Redirect to login if not authenticated
        return;
    }
    const { goalText, day } = req.body; // Extract goal details for deletion
    plannerModel.deleteGoal(req.session.user.username, day, goalText); // Delete the goal
    res.redirect('/planner/dashboard'); // Redirect to dashboard
};