import Habit from "../models/Habit.js";

// ✅ Get habits for the logged-in user
export const getHabits = async (req, res) => {
	try {
		const userId = req.userId; // Extracted from JWT middleware
		const habits = await Habit.find({ userId });

		res.status(200).json(habits);
	} catch (error) {
		res.status(500).json({ message: "Error fetching habits", error });
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
		const userId = req.userId;
		const { id } = req.params;
		const today = new Date().toISOString().split("T")[0];

		const habit = await Habit.findOne({ _id: id, userId });

		if (!habit) {
			return res
				.status(404)
				.json({ message: "Habit not found or unauthorized" });
		}

		// Prevent duplicate entries for the same day
		if (!habit.completedDates.includes(today)) {
			habit.completedDates.push(today);
			habit.streak += 1;
			await habit.save();
		}

		res.status(200).json(habit);
	} catch (error) {
		res.status(500).json({ message: "Error updating habit", error });
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
