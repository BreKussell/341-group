const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');

router.get('/dashboard', plannerController.dashboard);
router.get('/addGoal', (req, res) => res.render('addGoal'));
router.post('/addGoal', plannerController.addGoal);
router.get('/updateGoal', (req, res) => res.render('updateGoal', { goals: plannerController.getGoalsForUpdate(req) }));
router.post('/updateGoal', plannerController.updateGoal);

module.exports = router;
