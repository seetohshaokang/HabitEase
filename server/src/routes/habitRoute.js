import express from "express";
import {
	addHabit,
	deleteHabit,
	deleteHabitLog,
	getAllHabitsStatistics,
	getHabitById,
	getHabitLogs,
	getHabitStatistics,
	getHabits,
	logHabit,
	updateHabitLog,
} from "../controllers/habitController.js"; // ✅ Fixed typo
import { generateSampleData } from "../controllers/sampleDataController.js";
import { verifyToken } from "../middleware/auth.js"; // ✅ Ensures only authenticated users access routes

const router = express.Router();

// ✅ Get all habits for the logged-in user
router.get("/", verifyToken, getHabits);

// ✅ Add a new habit for the logged-in user
router.post("/", verifyToken, addHabit);

// ✅ Log habit completion
router.put("/:id/complete", verifyToken, logHabit);

// Load sample data
router.post("/sample-data", verifyToken, generateSampleData);

// Get details of a single habit
router.get("/:id", verifyToken, getHabitById);

// ✅ Get all habit logs for a specific habit
router.get("/:id/logs", verifyToken, getHabitLogs);

// ✅ Update a habit log entry
router.put("/log/:logId", verifyToken, updateHabitLog);

// Delete a habit log entry
router.delete("/log/:logId", verifyToken, deleteHabitLog);

// ✅ Delete a habit by ID
router.delete("/:id", verifyToken, deleteHabit);

// Get statistics for a specific habit
router.get("/:id/statistics", verifyToken, getHabitStatistics);

// Get statistics summary for all habits
router.get("/statistics/summary", verifyToken, getAllHabitsStatistics);

export default router;
