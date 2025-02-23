import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
	userId: { type: String, required: true }, // Associates habits with a user
	name: { type: String, required: true },
	streak: { type: Number, default: 0 },
	completedDates: { type: [String], default: [] },
});

export default mongoose.model("Habit", HabitSchema);
