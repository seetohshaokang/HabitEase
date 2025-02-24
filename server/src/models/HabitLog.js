import mongoose from "mongoose";

const HabitLogSchema = new mongoose.Schema({
	habitId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Habit",
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	timeStamp: {
		type: Date,
		default: Date.now,
	}, // Log time of habit completion
	value: {
		type: String,
		default: null,
	}, // Optional unit value (e.g., "20mins")
});

export const HabitLog = mongoose.model("HabitLog", HabitLogSchema);
