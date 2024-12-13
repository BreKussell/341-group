const fs = require('fs'); // File system module for reading/writing files
const path = './data/data.json'; // Path to the JSON file storing user data

// Retrieve goals for a specific user
exports.getGoals = (username) => {
    try {
        const data = JSON.parse(fs.readFileSync(path)); // Read and parse the JSON file
        const user = data.users.find(u => u.username === username); // Find the user by username
        return user && user.goals ? user.goals : {}; // Return goals or an empty object if none found
    } catch (error) {
        console.error('Error reading goals:', error); // Log errors
        return {}; // Return an empty object on error
    }
};

// Add a goal for a specific user
exports.addGoal = (username, day, type, text) => {
    try {
        const data = JSON.parse(fs.readFileSync(path)); // Read and parse the JSON file
        const user = data.users.find(u => u.username === username); // Find the user by username
        if (user) {
            if (!user.goals[day]) user.goals[day] = []; // Initialize goals for the day if not present
            user.goals[day].push({ type, text }); // Add the new goal
            fs.writeFileSync(path, JSON.stringify(data, null, 2)); // Save changes to the file
        }
    } catch (error) {
        console.error('Error adding goal:', error); // Log errors
    }
};

// Update a goal for a specific user
exports.updateGoal = (username, currentText, newDay, newText) => {
    try {
        const data = JSON.parse(fs.readFileSync(path)); // Read and parse the JSON file
        const user = data.users.find(u => u.username === username); // Find the user by username
        if (user) {
            // Remove the goal with matching text
            Object.keys(user.goals).forEach(day => {
                user.goals[day] = user.goals[day].filter(goal => goal.text !== currentText);
            });
            // Add the updated goal to the new day
            if (!user.goals[newDay]) user.goals[newDay] = [];
            user.goals[newDay].push({ type: 'Updated', text: newText });
            fs.writeFileSync(path, JSON.stringify(data, null, 2)); // Save changes to the file
        }
    } catch (error) {
        console.error('Error updating goal:', error); // Log errors
    }
};

// Delete a goal for a specific user
exports.deleteGoal = (username, day, goalText) => {
    try {
        const data = JSON.parse(fs.readFileSync(path)); // Read and parse the JSON file
        const user = data.users.find(u => u.username === username); // Find the user by username
        if (user && user.goals[day]) {
            user.goals[day] = user.goals[day].filter(goal => goal.text !== goalText); // Remove goal with matching text
            fs.writeFileSync(path, JSON.stringify(data, null, 2)); // Save changes to the file
        }
    } catch (error) {
        console.error('Error deleting goal:', error); // Log errors
    }
};
