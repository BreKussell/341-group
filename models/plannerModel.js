const fs = require('fs');
const path = './data/data.json';

exports.getGoals = (username) => {
    try {
        const data = JSON.parse(fs.readFileSync(path));
        const user = data.users.find(u => u.username === username);
        return user && user.goals ? user.goals : {}; // Default to empty object
    } catch (error) {
        console.error('Error reading goals:', error);
        return {}; // Return an empty object on error
    }
};

exports.addGoal = (username, day, type, text) => {
    try {
        const data = JSON.parse(fs.readFileSync(path));
        const user = data.users.find(u => u.username === username);
        if (user) {
            if (!user.goals[day]) user.goals[day] = [];
            user.goals[day].push({ type, text });
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Error adding goal:', error);
    }
};

exports.updateGoal = (username, currentText, newDay, newText) => {
    try {
        const data = JSON.parse(fs.readFileSync(path));
        const user = data.users.find(u => u.username === username);
        if (user) {
            Object.keys(user.goals).forEach(day => {
                user.goals[day] = user.goals[day].filter(goal => goal.text !== currentText);
            });
            if (!user.goals[newDay]) user.goals[newDay] = [];
            user.goals[newDay].push({ type: 'Updated', text: newText });
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Error updating goal:', error);
    }
};
