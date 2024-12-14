import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the structure of a goal
interface Goal {
    type: string;
    text: string;
}

// Define the structure of a user document
interface User extends Document {
    username: string;
    goals: Map<string, Goal[]>;
}

// Create the Mongoose schema for users
const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    goals: { type: Map, of: [{ type: Object }], default: {} }, // Map of day to Goal[]
});

// Create a Mongoose model for users
const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

const plannerModel = {
    // Retrieve goals for a specific user
    async getGoals(username: string): Promise<Record<string, Goal[]>> {
        try {
            const user = await UserModel.findOne({ username });
            if (!user) return {};
            const plainGoals: Record<string, Goal[]> = {};
            user.goals.forEach((value, key) => {
                plainGoals[key] = value; // Convert Map to a plain object
            });
            return plainGoals;
        } catch (error) {
            console.error('Error retrieving goals:', error);
            return {};
        }
    },

    // Add a goal for a specific user
    async addGoal(username: string, day: string, type: string, text: string): Promise<void> {
        try {
            const user = await UserModel.findOneAndUpdate(
                { username },
                { $push: { [`goals.${day}`]: { type, text } } },
                { upsert: true, new: true }
            );
            if (!user) {
                console.error('Failed to add goal: User not found or updated.');
            }
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    },

    // Update a goal for a specific user
    async updateGoal(username: string, currentText: string, newDay: string, newText: string): Promise<void> {
        try {
            const user = await UserModel.findOne({ username });
            if (!user) return;

            // Remove the goal with matching text
            user.goals.forEach((goals, day) => {
                user.goals.set(
                    day,
                    goals.filter(goal => goal.text !== currentText)
                );
            });

            // Add the updated goal to the new day
            const updatedGoals = user.goals.get(newDay) || [];
            updatedGoals.push({ type: 'Updated', text: newText });
            user.goals.set(newDay, updatedGoals);

            await user.save(); // Save changes to the database
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    },

    // Delete a goal for a specific user
    async deleteGoal(username: string, day: string, goalText: string): Promise<void> {
        try {
            const user = await UserModel.findOne({ username });
            if (!user || !user.goals.has(day)) return;

            const updatedGoals = user.goals.get(day)!.filter(goal => goal.text !== goalText);
            user.goals.set(day, updatedGoals);

            await user.save(); // Save changes to the database
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    },
};

export default plannerModel;
