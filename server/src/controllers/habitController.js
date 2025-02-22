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
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Habit name is required" });
		}

		const newHabit = new Habit({
			name,
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
export const updateHabit = async (req, res) => {
	try {
		const userId = req.userId;
		const { id } = req.params;
		const { streak, lastCompleted } = req.body;

		const updatedHabit = await Habit.findOneAndUpdate(
			{ _id: id, userId }, // Ensure only the user's habit is updated
			{ streak, lastCompleted },
			{ new: true }
		);

		if (!updatedHabit) {
			return res
				.status(404)
				.json({ message: "Habit not found or unauthorized" });
		}

		res.status(200).json(updatedHabit);
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
