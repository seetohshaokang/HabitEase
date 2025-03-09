// server/src/controllers/sampleDataController.js
import Habit from "../models/Habit.js";
import { HabitLog } from "../models/HabitLog.js";

export const generateSampleData = async (req, res) => {
	try {
		const userId = req.user.userId;

		// Check if the user already has habits
		const existingHabits = await Habit.find({ userId });
		if (existingHabits.length > 0) {
			return res.status(200).json({
				message: "Sample data not generated - user already has habits",
				existingCount: existingHabits.length,
			});
		}

		// Sample habits for this user
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

		// Create the habits
		const habits = await Habit.insertMany(sampleHabits);

		// Create sample logs for each habit
		let totalLogs = 0;

		for (const habit of habits) {
			const logs = [];

			// Current date - declare once and reuse
			const today = new Date();
			const todayStr = today.toISOString().split("T")[0];

			// Generate data for past 6 months
			for (let month = 0; month < 6; month++) {
				// Get the first day of this month
				const firstDayOfMonth = new Date(
					today.getFullYear(),
					today.getMonth() - month,
					1
				);
				// Get the last day of this month
				const lastDayOfMonth = new Date(
					today.getFullYear(),
					today.getMonth() - month + 1,
					0
				);

				// Number of days in this month
				const daysInMonth = lastDayOfMonth.getDate();

				// Create a pattern that shows different completion rates for each month
				// to make the monthly trends more visible
				const completionRate = 0.5 + 0.1 * (month % 3); // Varies between 50%, 60%, 70%

				// For the current month, make it more likely to have recent completions to show streaks
				const isCurrentMonth = month === 0;

				for (let day = 1; day <= daysInMonth; day++) {
					const date = new Date(firstDayOfMonth);
					date.setDate(day);

					// Don't create logs for future dates
					if (date > today) continue;

					// Logic to create patterns:
					// 1. More likely to complete on weekends (Sat/Sun)
					// 2. More likely to complete in the first half of the month
					// 3. For current month, more likely to complete recent days
					const isWeekend =
						date.getDay() === 0 || date.getDay() === 6;
					const isFirstHalfOfMonth = day <= 15;
					const isRecentDay = today.getDate() - date.getDate() < 5;

					let dayCompletionChance = completionRate;

					// Adjust completion chance based on our patterns
					if (isWeekend) dayCompletionChance += 0.15;
					if (isFirstHalfOfMonth) dayCompletionChance += 0.1;
					if (isCurrentMonth && isRecentDay)
						dayCompletionChance += 0.25;

					// Cap at 95% to ensure some variation
					dayCompletionChance = Math.min(dayCompletionChance, 0.95);

					if (Math.random() < dayCompletionChance) {
						// Generate realistic values based on habit type
						let value;

						if (habit.name === "Morning Run") {
							// Running times between 15-45 minutes
							value = Math.floor(
								15 + Math.random() * 30
							).toString();
						} else if (habit.name === "Read a Book") {
							// Pages read between 5-50
							value = Math.floor(
								5 + Math.random() * 45
							).toString();
						} else if (habit.name === "Drink Water") {
							// Glasses between 4-10
							value = Math.floor(
								4 + Math.random() * 6
							).toString();
						} else if (habit.name === "Meditation") {
							// Meditation between 5-20 minutes
							value = Math.floor(
								5 + Math.random() * 15
							).toString();
						} else {
							value = null;
						}

						logs.push({
							habitId: habit._id,
							userId,
							timeStamp: date,
							value,
						});
					}
				}
			}

			const insertedLogs = await HabitLog.insertMany(logs);
			totalLogs += insertedLogs.length;

			// Update the habit's streak if there are recent logs
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);
			const yesterdayStr = yesterday.toISOString().split("T")[0];

			// Check if completed today or yesterday to calculate streak
			const recentLogs = logs.filter((log) => {
				const logDate = new Date(log.timeStamp)
					.toISOString()
					.split("T")[0];
				return logDate === todayStr || logDate === yesterdayStr;
			});

			if (recentLogs.length > 0) {
				// Set streak to a number between 3-15 to make it look realistic
				const streak = Math.floor(3 + Math.random() * 12);
				await Habit.findByIdAndUpdate(habit._id, { streak });
			}
		}

		res.status(201).json({
			message: "Sample data generated successfully",
			habitsCreated: habits.length,
			logsCreated: totalLogs,
		});
	} catch (error) {
		console.error("Error generating sample data:", error);
		res.status(500).json({ error: "Failed to generate sample data" });
	}
};
