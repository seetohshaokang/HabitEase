import express from "express";
import {
	addHabit,
	deleteHabit,
	getHabits,
	updateHabit,
} from "../controllers/habitController.js"; // ✅ Fixed typo

import { verifyToken } from "../middleware/auth.js"; // ✅ Ensures only authenticated users access routes

const router = express.Router();

// ✅ Get all habits for the logged-in user
router.get("/", verifyToken, getHabits);

// ✅ Add a new habit for the logged-in user
router.post("/", verifyToken, addHabit);

// ✅ Update an existing habit (e.g., mark as completed)
router.put("/:id", verifyToken, updateHabit);

// ✅ Delete a habit by ID
router.delete("/:id", verifyToken, deleteHabit);

export default router;
