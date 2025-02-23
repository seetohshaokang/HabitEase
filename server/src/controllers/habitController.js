import Habit from "../models/Habit.js";

// ✅ Get habits for the logged-in user
export const getHabits = async (req, res) => {
	try {
		console.log("Decoded User Object:", req.user); // ✅ Debugging

		if (!req.user || !req.user.userId) {
			console.error("User ID is missing in request:", req.user);
			return res
				.status(401)
				.json({ error: "Unauthorized: No user found" });
		}

		const habits = await Habit.find({ userId: req.user.userId }); // ✅ Fix userId reference
		res.status(200).json(habits);
	} catch (error) {
		console.error("Error fetching habits:", error);
		res.status(500).json({ error: "Server error" });
	}
};

// ✅ Add a new habit for the logged-in user
export const addHabit = async (req, res) => {
	try {
		const userId = req.user.userId; // ✅ Fix userId extraction
		const { name, logo } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Habit name is required" });
		}

		const newHabit = new Habit({
			name,
			logo: logo || "🔥", // ✅ Default icon
			userId,
			streak: 0,
			lastCompleted: null,
			completedRecords: [],
		});
		await newHabit.save();

		res.status(201).json(newHabit);
	} catch (error) {
		console.error("Error creating habit:", error);
		res.status(500).json({ message: "Error creating habit", error });
	}
};

// ✅ Mark a habit as completed
export const completeHabit = async (req, res) => {
	try {
		const { id } = req.params;
		const habit = await Habit.findById(id);

		if (!habit) return res.status(404).json({ error: "Habit not found" });

		const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
		const recordIndex = habit.completedRecords.findIndex(
			(record) => record.date === today
		);

		if (recordIndex !== -1) {
			// ✅ If already completed today, just increase count
			habit.completedRecords[recordIndex].count += 1;
		} else {
			// ✅ First completion of the day → add new record & increase streak
			habit.completedRecords.push({ date: today, count: 1 });

			// ✅ Streak logic: Only increase if yesterday was also completed
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			const yesterdayStr = yesterday.toISOString().split("T")[0];

			const yesterdayRecord = habit.completedRecords.find(
				(record) => record.date === yesterdayStr
			);

			if (yesterdayRecord) {
				habit.streak += 1;
			} else {
				habit.streak = 1; // Reset streak if yesterday was not completed
			}
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
		const userId = req.user.userId; // ✅ Fix userId extraction
		const { id } = req.params;

		const deletedHabit = await Habit.findOneAndDelete({ _id: id, userId });

		if (!deletedHabit) {
			return res
				.status(404)
				.json({ message: "Habit not found or unauthorized" });
		}

		res.status(200).json({ message: "Habit deleted successfully" });
	} catch (error) {
		console.error("Error deleting habit:", error);
		res.status(500).json({ message: "Error deleting habit", error });
	}
};
