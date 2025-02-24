import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
	userId: { type: String, required: true }, // Associates habits with a user
	name: { type: String, required: true },
	logo: { type: String, default: "default-icon.png" },
	streak: { type: Number, default: 0 },
	unit: { type: String, default: null }, // Optional unit of measurement
});

export default mongoose.model("Habit", HabitSchema);
