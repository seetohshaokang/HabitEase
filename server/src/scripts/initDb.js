// server/src/scripts/initDb.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Habit from "../models/Habit.js";
import { HabitLog } from "../models/HabitLog.js";

dotenv.config();

// Sample user ID
const userId = "sample-user-001";

// Sample habits
const sampleHabits = [
	{
		userId,
		name: "Morning Run",
		logo: "🏃‍♂️",
		streak: 5,
		unit: "minutes",
	},
	{
		userId,
		name: "Read a Book",
		logo: "📚",
		streak: 12,
		unit: "pages",
	},
	{
		userId,
		name: "Drink Water",
		logo: "💧",
		streak: 8,
		unit: "glasses",
	},
	{
		userId,
		name: "Meditation",
		logo: "🧘‍♀️",
		streak: 3,
		unit: "minutes",
	},
];

// Function to create sample logs for a habit
const createSampleLogs = async (habitId) => {
	const logs = [];
	// Create logs for the past 30 days with 70% completion rate
	for (let i = 0; i < 30; i++) {
		// Skip some days to simulate real usage (70% completion)
		if (Math.random() < 0.7) {
			const date = new Date();
			date.setDate(date.getDate() - i);

			// For habits with units, generate random values
			const value = Math.floor(Math.random() * 60 + 1).toString();

			logs.push({
				habitId,
				userId,
				timeStamp: date,
				value,
			});
		}
	}

	return HabitLog.insertMany(logs);
};

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URL)
	.then(async () => {
		console.log("Connected to MongoDB. Initializing database...");

		// Clear existing data
		await Habit.deleteMany({ userId });
		await HabitLog.deleteMany({ userId });

		// Insert sample habits
		const habits = await Habit.insertMany(sampleHabits);
		console.log(`Added ${habits.length} sample habits`);

		// Create logs for each habit
		for (const habit of habits) {
			const logs = await createSampleLogs(habit._id);
			console.log(`Added ${logs.length} logs for habit "${habit.name}"`);
		}

		console.log("Database initialization complete!");
		mongoose.connection.close();
	})
	.catch((error) => {
		console.error("Database initialization failed:", error);
		process.exit(1);
	});
