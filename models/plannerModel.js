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

// Retrieve goals for a specific user
exports.getGoals = async (username) => {
    try {
        const user = await User.findOne({ username }); // Find the user by username
        return user && user.goals ? user.goals : {}; // Return goals or an empty object if none found
    } catch (error) {
        console.error('Error reading goals:', error); // Log errors
        return {}; // Return an empty object on error
    }
};

// Add a goal for a specific user
exports.addGoal = async (username, day, type, text) => {
    try {
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
        }
    } catch (error) {
        console.error('Error adding goal:', error); // Log errors
    }
};

// Update a goal for a specific user
exports.updateGoal = async (username, currentText, newDay, newText) => {
    try {
        const user = await User.findOne({ username });
        if (user) {
            // Remove the goal with matching text from all days
            user.goals.forEach((goals, day) => {
                user.goals.set(day, goals.filter(goal => goal.text !== currentText));
            });

            // Add the updated goal to the new day
            if (!user.goals.has(newDay)) user.goals.set(newDay, []);
            user.goals.get(newDay).push({ type: 'Updated', text: newText });
            await user.save(); // Save changes to the database
        }
    } catch (error) {
        console.error('Error updating goal:', error); // Log errors
    }
};

// Delete a goal for a specific user
exports.deleteGoal = async (username, day, goalText) => {
    try {
        const user = await User.findOne({ username });
        if (user && user.goals.has(day)) {
            const updatedGoals = user.goals.get(day).filter(goal => goal.text !== goalText); // Remove goal with matching text
            if (updatedGoals.length > 0) {
                user.goals.set(day, updatedGoals);
            } else {
                user.goals.delete(day); // Delete the day if no goals are left
            }
            await user.save(); // Save changes to the database
        }
    } catch (error) {
        console.error('Error deleting goal:', error); // Log errors
    }
};