import express from "express";
import {
	addHabit,
	deleteHabit,
	getHabitLogs,
	getHabits,
	logHabit,
	updateHabitLog,
} from "../controllers/habitController.js"; // ✅ Fixed typo

import { verifyToken } from "../middleware/auth.js"; // ✅ Ensures only authenticated users access routes

const router = express.Router();

// ✅ Get all habits for the logged-in user
router.get("/", verifyToken, getHabits);

// ✅ Add a new habit for the logged-in user
router.post("/", verifyToken, addHabit);

// ✅ Log habit completion
router.put("/:id/complete", verifyToken, logHabit);

// ✅ Get all habit logs for a specific habit
router.get(":/id/logs", verifyToken, getHabitLogs);

// ✅ Update a habit log entry
router.put("/log/:logId", verifyToken, updateHabitLog);

// ✅ Delete a habit by ID
router.delete("/:id", verifyToken, deleteHabit);

export default router;
