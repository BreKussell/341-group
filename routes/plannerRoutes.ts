import express, { Router, Request, Response } from 'express'; // Import Express framework and types
import {
    dashboard,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalsForUpdate,
} from '../controllers/plannerController'; // Import planner controller methods

const router: Router = express.Router(); // Create a router object

// Route to display the dashboard with goals
router.get('/dashboard', dashboard);

// Route to render the addGoal page
router.get('/addGoal', (req: Request, res: Response) => res.render('addGoal'));

// Route to handle adding a new goal
router.post('/addGoal', addGoal);

// Route to render the updateGoal page with existing goals
router.get('/updateGoal', (req: Request, res: Response) =>
    res.render('updateGoal', { goals: getGoalsForUpdate(req) })
);

// Route to handle updating a goal
router.post('/updateGoal', updateGoal);

// Route to render the deleteGoal page
router.get('/deleteGoal', (req: Request, res: Response) =>
    res.render('deleteGoal', { goals: getGoalsForUpdate(req) })
);

// Route to handle deleting a goal
router.post('/deleteGoal', deleteGoal);

export default router; // Export the router as default