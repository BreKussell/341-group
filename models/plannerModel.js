<<<<<<< HEAD
const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    goals: {
        type: Map,
        of: [
            {
                type: { type: String, required: true },
                text: { type: String, required: true }
            }
        ]
    }
});

// Create the User model
const User = mongoose.model('User', userSchema);
=======
const mongodb = require('../db/connect'); // MongoDB connection module
>>>>>>> eff836d969d016b4269d55c0316c11f9834f22b4

// Retrieve goals for a specific user
exports.getGoals = async (username) => {
    try {
<<<<<<< HEAD
        const user = await User.findOne({ username }); // Find the user by username
=======
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username
>>>>>>> eff836d969d016b4269d55c0316c11f9834f22b4
        return user && user.goals ? user.goals : {}; // Return goals or an empty object if none found
    } catch (error) {
        console.error('Error reading goals:', error); // Log errors
        return {}; // Return an empty object on error
    }
};

// Add a goal for a specific user
exports.addGoal = async (username, day, type, text) => {
    try {
<<<<<<< HEAD
        const user = await User.findOne({ username });
        if (user) {
            if (!user.goals.has(day)) user.goals.set(day, []); // Initialize goals for the day if not present
            user.goals.get(day).push({ type, text }); // Add the new goal
            await user.save(); // Save changes to the database
        } else {
            // If user does not exist, create a new user
            const newUser = new User({
                username,
                goals: { [day]: [{ type, text }] }
            });
            await newUser.save();
=======
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
>>>>>>> eff836d969d016b4269d55c0316c11f9834f22b4
        }
    } catch (error) {
        console.error('Error adding goal:', error); // Log errors
    }
};

// Update a goal for a specific user
exports.updateGoal = async (username, currentText, newDay, newText) => {
    try {
<<<<<<< HEAD
        const user = await User.findOne({ username });
        if (user) {
            // Remove the goal with matching text from all days
            user.goals.forEach((goals, day) => {
                user.goals.set(day, goals.filter(goal => goal.text !== currentText));
=======
        const db = mongodb.getDb(); // Get the database instance
        const user = await db.collection('users').findOne({ username }); // Find the user by username
        if (user) {
            const goals = user.goals || {};
            // Remove the goal with matching text
            Object.keys(goals).forEach(day => {
                goals[day] = goals[day].filter(goal => goal.text !== currentText);
>>>>>>> eff836d969d016b4269d55c0316c11f9834f22b4
            });

            // Add the updated goal to the new day
<<<<<<< HEAD
            if (!user.goals.has(newDay)) user.goals.set(newDay, []);
            user.goals.get(newDay).push({ type: 'Updated', text: newText });
            await user.save(); // Save changes to the database
=======
            if (!goals[newDay]) goals[newDay] = [];
            goals[newDay].push({ type: 'Updated', text: newText });

            // Update the user's goals in the database
            await db.collection('users').updateOne(
                { username },
                { $set: { goals } }
            );
>>>>>>> eff836d969d016b4269d55c0316c11f9834f22b4
        }
    } catch (error) {
        console.error('Error updating goal:', error); // Log errors
    }
};

// Delete a goal for a specific user
exports.deleteGoal = async (username, day, goalText) => {
    try {
<<<<<<< HEAD
        const user = await User.findOne({ username });
        if (user && user.goals.has(day)) {
            const updatedGoals = user.goals.get(day).filter(goal => goal.text !== goalText); // Remove goal with matching text
            if (updatedGoals.length > 0) {
                user.goals.set(day, updatedGoals);
            } else {
                user.goals.delete(day); // Delete the day if no goals are left
            }
            await user.save(); // Save changes to the database
=======
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
>>>>>>> eff836d969d016b4269d55c0316c11f9834f22b4
        }
    } catch (error) {
        console.error('Error deleting goal:', error); // Log errors
    }
};