import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
	name: { type: String, required: true },
	streak: { type: Number, default: 0 },
});

export default mongoose.model("Habit", HabitSchema);
