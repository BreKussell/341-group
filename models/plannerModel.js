const mongodb = require('../db/connect'); // MongoDB connection module

// Retrieve goals for a specific user
exports.getGoals = async (username) => {
    try {
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username
        return user && user.goals ? user.goals : {}; // Return goals or an empty object if none found
    } catch (error) {
        console.error('Error reading goals:', error); // Log errors
        return {}; // Return an empty object on error
    }
};

// Add a goal for a specific user
exports.addGoal = async (username, day, type, text) => {
    try {
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username
        if (user) {
            const goals = user.goals || {}; // Initialize goals if not present
            if (!goals[day]) goals[day] = []; // Initialize goals for the day if not present
            goals[day].push({ type, text }); // Add the new goal

            // Update the user's goals in the database
            await db.collection('users').updateOne(
                { username },
                { $set: { goals } }
            );
        }
    } catch (error) {
        console.error('Error adding goal:', error); // Log errors
    }
};

// Update a goal for a specific user
exports.updateGoal = async (username, currentText, newDay, newText) => {
    try {
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username
        if (user) {
            const goals = user.goals || {};
            // Remove the goal with matching text
            Object.keys(goals).forEach(day => {
                goals[day] = goals[day].filter(goal => goal.text !== currentText);
            });

            // Add the updated goal to the new day
            if (!goals[newDay]) goals[newDay] = [];
            goals[newDay].push({ type: 'Updated', text: newText });

            // Update the user's goals in the database
            await db.collection('users').updateOne(
                { username },
                { $set: { goals } }
            );
        }
    } catch (error) {
        console.error('Error updating goal:', error); // Log errors
    }
};

// Delete a goal for a specific user
exports.deleteGoal = async (username, day, goalText) => {
    try {
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username
        if (user && user.goals && user.goals[day]) {
            const goals = user.goals;
            goals[day] = goals[day].filter(goal => goal.text !== goalText); // Remove goal with matching text

            // Update the user's goals in the database
            await db.collection('users').updateOne(
                { username },
                { $set: { goals } }
            );
        }
    } catch (error) {
        console.error('Error deleting goal:', error); // Log errors
    }
};