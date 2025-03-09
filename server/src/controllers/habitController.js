import Habit from "../models/Habit.js";
import { HabitLog } from "../models/HabitLog.js";

// ✅ Get habits for the logged-in user
export const getHabits = async (req, res) => {
	try {
		// console.log("Decoded User Object:", req.user);
		if (!req.user || !req.user.userId) {
			console.error("User ID is missing in request:", req.user);
			return res
				.status(401)
				.json({ error: "Unauthorized: No user found" });
		}

		const habits = await Habit.find({ userId: req.user.userId });
		res.status(200).json(habits);
	} catch (error) {
		console.error("Error fetching habits:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ Add a new habit for the logged-in user
export const addHabit = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { name, logo, unit } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Habit name is required" });
		}

		const newHabit = new Habit({
			name,
			logo: logo || "🔥",
			unit: unit || null,
			userId,
			streak: 0,
		});
		await newHabit.save();
		res.status(201).json(newHabit);
	} catch (error) {
		console.error("Error creating habit:", error);
		res.status(500).json({ message: "Error creating habit", error });
	}
};

// ✅ Delete a habit (only for the logged-in user)
export const deleteHabit = async (req, res) => {
	try {
		const userId = req.user.userId; // ✅ Fix userId extraction
		const { id } = req.params;
		const deletedHabit = await Habit.findOneAndDelete({ _id: id, userId });
		if (!deletedHabit) {
			return res
				.status(404)
				.json({ message: "Habit not found or unauthorized" });
		}
		await HabitLog.deleteMany({ habitId: id }); // Delete Habit logs for that habit
		res.status(200).json({ message: "Habit deleted successfully" });
	} catch (error) {
		console.error("Error deleting habit:", error);
		res.status(500).json({ message: "Error deleting habit", error });
	}
};

// Log habit completion
export const logHabit = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.userId;
		const { value } = req.body;
		const habit = await Habit.findById(id);

		if (!habit) return res.status(404).json({ error: "Habit not found" });

		const newLog = new HabitLog({
			habitId: id,
			userId,
			value: value || null,
		});
		await newLog.save();
		res.status(201).json(newLog);
	} catch (error) {
		console.error("Error completing habit:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const getHabitById = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.userId;

		const habit = await Habit.findOne({ _id: id, userId });

		if (!habit) {
			return res.status(404).json({ error: "Habit not found" });
		}

		res.status(200).json(habit);
	} catch (error) {
		console.error("Error fetching habit by ID:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ Get all habit logs for a specific habit
export const getHabitLogs = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.userId;

		// Check if id is a Promise and resolve it
		const habitId = id instanceof Promise ? await id : id;

		const habitLogs = await HabitLog.find({ habitId: id, userId });

		res.status(200).json(habitLogs);
	} catch (error) {
		console.error("Error fetching habit logs:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ Update a habit log entry
export const updateHabitLog = async (req, res) => {
	try {
		const { logId } = req.params;
		const userId = req.user.userId;
		const { value, timestamp } = req.body;

		const habitLog = await HabitLog.findOneAndUpdate(
			{ _id: logId, userId },
			{ value, timestamp },
			{ new: true }
		);

		if (!habitLog) {
			return res.status(404).json({ error: "Habit log not found" });
		}

		res.status(200).json(habitLog);
	} catch (error) {
		console.error("Error updating habit log:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ Delete a habit log entry
export const deleteHabitLog = async (req, res) => {
	try {
		const { logId } = req.params;
		const userId = req.user.userId;

		const deletedLog = await HabitLog.findOneAndDelete({
			_id: logId,
			userId,
		});

		if (!deletedLog) {
			return res.status(404).json({ error: "Habit log not found" });
		}

		res.status(200).json({ message: "Habit log deleted successfully" });
	} catch (error) {
		console.error("Error deleting habit log:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// Get statistics for a specific habit
export const getHabitStatistics = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.userId;

		// Find the habit to ensure it exists and belongs to the user
		const habit = await Habit.findOne({ _id: id, userId });
		if (!habit) {
			return res.status(404).json({ error: "Habit not found" });
		}

		// Get all logs for this habit
		const habitLogs = await HabitLog.find({ habitId: id, userId });

		// If no logs, return basic stats
		if (habitLogs.length === 0) {
			return res.status(200).json({
				habitId: id,
				totalLogs: 0,
				completionDays: [],
				completionRate: 0,
				firstLogDate: null,
				lastLogDate: null,
				currentMonthCompletions: 0,
				previousMonthCompletions: 0,
			});
		}

		// Sort logs by timestamp
		habitLogs.sort((a, b) => a.timeStamp - b.timeStamp);

		// Get date-only strings from timestamps (YYYY-MM-DD)
		const completionDays = habitLogs.map(
			(log) => new Date(log.timeStamp).toISOString().split("T")[0]
		);

		// Remove duplicates (in case of multiple logs on same day)
		const uniqueCompletionDays = [...new Set(completionDays)];

		// Calculate date ranges
		const firstLogDate = new Date(habitLogs[0].timeStamp);
		const lastLogDate = new Date(habitLogs[habitLogs.length - 1].timeStamp);

		// Calculate days since habit creation
		const daysSinceCreation = Math.ceil(
			(new Date() - firstLogDate) / (1000 * 60 * 60 * 24)
		);

		// Calculate completion rate
		const completionRate =
			daysSinceCreation > 0
				? (
						(uniqueCompletionDays.length / daysSinceCreation) *
						100
				  ).toFixed(1)
				: 100;

		// Get current month and previous month completions
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();
		const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		const previousMonthYear =
			currentMonth === 0 ? currentYear - 1 : currentYear;

		const currentMonthCompletions = habitLogs.filter((log) => {
			const logDate = new Date(log.timeStamp);
			return (
				logDate.getMonth() === currentMonth &&
				logDate.getFullYear() === currentYear
			);
		}).length;

		const previousMonthCompletions = habitLogs.filter((log) => {
			const logDate = new Date(log.timeStamp);
			return (
				logDate.getMonth() === previousMonth &&
				logDate.getFullYear() === previousMonthYear
			);
		}).length;

		// Calculate month-over-month change
		const monthlyChangePercentage =
			previousMonthCompletions > 0
				? (
						((currentMonthCompletions - previousMonthCompletions) /
							previousMonthCompletions) *
						100
				  ).toFixed(1)
				: null;

		// Return statistics
		res.status(200).json({
			habitId: id,
			totalLogs: habitLogs.length,
			uniqueCompletionDays: uniqueCompletionDays.length,
			completionDays: uniqueCompletionDays,
			completionRate: parseFloat(completionRate),
			firstLogDate,
			lastLogDate,
			daysSinceCreation,
			currentMonthCompletions,
			previousMonthCompletions,
			monthlyChangePercentage: monthlyChangePercentage
				? parseFloat(monthlyChangePercentage)
				: null,
		});
	} catch (error) {
		console.error("Error fetching habit statistics:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// Get statistics summary for all habits
export const getAllHabitsStatistics = async (req, res) => {
	try {
		const userId = req.user.userid;

		// Get all habits for this user
		const habits = await Habit.find({ userId });

		if (habits.length === 0) {
			return res.status(200).json({
				totalHabits: 0,
				habitStats: [],
			});
		}

		// Get all logs for this user
		const allLogs = await HabitLog.find({ userId });

		// Process stats for each habit
		const habitStats = await Promise.all(
			habits.map(async (habit) => {
				const habitLogs = allLogs.filter(
					(log) => log.habitId.toString() === habit._id.toString()
				);

				if (habitLogs.length === 0) {
					return {
						habitId: habit._id,
						name: habit.name,
						logo: habit.logo,
						totalLogs: 0,
						completionRate: 0,
					};
				}

				// Get unique completion days
				const completionDays = habitLogs.map(
					(log) => new Date(log.timeStamp).toISOString().split("T")[0]
				);
				const uniqueDays = [...new Set(completionDays)];

				// Calculate completion rate (last 30 days)
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

				const recentLogs = habitLogs.filter(
					(log) => new Date(log.timeStamp >= thirtyDaysAgo)
				);

				const recentDays = recentLogs.map(
					(log) => new Date(log.timeStamp).toISOString().split("T")[0]
				);

				const uniqueRecentDays = [...new Set(recentDays)];

				const completionRate = (
					(uniqueRecentDays.length / 30) *
					100
				).toFixed(1);

				return {
					habitId: habit._id,
					name: habit.name,
					logo: habit.logo,
					totalLogs: habitLogs.length,
					completionDays: uniqueDays.length,
					recentCompletionRate: parseFloat(completionRate),
					lastCompleted:
						habitLogs.length > 0
							? new Date(
									Math.max(
										...habitLogs.map(
											(log) => new Date(log.timeStamp)
										)
									)
							  )
							: null,
				};
			})
		);

		// Calculate overall statistics
		const totalLogs = allLogs.length;
		const mostConsistentHabitId =
			habitStats.length > 0
				? habitStats.reduce((prev, current) =>
						prev.recentCompletionRate > current.recentCompletionRate
							? prev
							: current
				  ).habitId
				: null;

		res.status(200).json({
			totalHabits: habits.length,
			totalLogs,
			mostConsistentHabitId,
			habitStats,
		});
	} catch (error) {
		console.error("Error fetching all habits statistics:", error);
		res.status(500).json({ error: "Server error" });
	}
};
