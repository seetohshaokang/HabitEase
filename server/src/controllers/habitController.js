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

// ✅ Get all habit logs for a specific habit
export const getHabitLogs = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.userId;

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
