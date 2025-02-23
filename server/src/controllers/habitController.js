import Habit from "../models/Habit.js";

// ✅ Get habits for the logged-in user
export const getHabits = async (req, res) => {
	try {
		console.log("Decoded User Object:", req.user); // ✅ Debugging line

		if (!req.user || !req.user.id) {
			console.error("User ID is missing in request:", req.user);
			return res
				.status(401)
				.json({ error: "Unauthorized: No user found" });
		}

		const habits = await Habit.find({ userId: req.user.id });
		res.status(200).json(habits);
	} catch (error) {
		console.error("Error fetching habits:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ Add a new habit for the logged-in user
export const addHabit = async (req, res) => {
	try {
		const userId = req.userId; // Extracted from JWT middleware
		const { name, logo } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Habit name is required" });
		}

		const newHabit = new Habit({
			name,
			logo: logo || "default-icon.png",
			userId,
			streak: 0,
			lastCompleted: null,
		});
		await newHabit.save();

		res.status(201).json(newHabit);
	} catch (error) {
		res.status(500).json({ message: "Error creating habit", error });
	}
};

// ✅ Update a habit (only for the logged-in user)
export const completeHabit = async (req, res) => {
	try {
		const { id } = req.params;
		const habit = await Habit.findById(id);

		if (!habit) return res.status(404).json({ error: "Habit not found" });

		const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
		const recordIndex = habit.completedRecords.findIndex(
			(record) => record.date === today
		);

		// If the habit was already completed today, increment the count
		if (recordIndex !== -1) {
			habit.completedRecords[recordIndex].count += 1;
		} else {
			// Otherwise, add a new record for today
			habit.completedRecords.push({ date: today, count: 1 });
			habit.streak += 1; // Increase streak only if first completion of the day
		}

		await habit.save();
		res.status(200).json(habit);
	} catch (error) {
		console.error("Error completing habit:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ Delete a habit (only for the logged-in user)
export const deleteHabit = async (req, res) => {
	try {
		const userId = req.userId;
		const { id } = req.params;

		const deletedHabit = await Habit.findOneAndDelete({ _id: id, userId });

		if (!deletedHabit) {
			return res
				.status(404)
				.json({ message: "Habit not found or unauthorized" });
		}

		res.status(200).json({ message: "Habit deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting habit", error });
	}
};
