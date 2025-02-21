import Habit from "../models/Habit.js";

// ✅ Get all habits
export const getHabits = async (req, res) => {
	try {
		const habits = await Habit.find();
		res.status(200).json(habits);
	} catch (error) {
		res.status(500).json({ message: "Error fetching habits", error });
	}
};

// ✅ Add a new habit
export const addHabit = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name)
			return res.status(400).json({ message: "Habit name is required" });

		const newHabit = new Habit({ name });
		await newHabit.save();
		res.status(201).json(newHabit);
	} catch (error) {
		res.status(500).json({ message: "Error creating habit", error });
	}
};

// ✅ Update a habit (e.g., increase streak)
export const updateHabit = async (req, res) => {
	try {
		const { id } = req.params;
		const { streak, lastCompleted } = req.body;

		const updatedHabit = await Habit.findByIdAndUpdate(
			id,
			{ streak, lastCompleted },
			{ new: true }
		);
		if (!updatedHabit)
			return res.status(404).json({ message: "Habit not found" });

		res.status(200).json(updatedHabit);
	} catch (error) {
		res.status(500).json({ message: "Error updating habit", error });
	}
};

// ✅ Delete a habit
export const deleteHabit = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedHabit = await Habit.findByIdAndDelete(id);

		if (!deletedHabit)
			return res.status(404).json({ message: "Habit not found" });

		res.status(200).json({ message: "Habit deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting habit", error });
	}
};
