import express from "express";
import { addHabit, getHabits } from "../controllers/habitControoler.js";

const router = express.Router();
router.get("/", getHabits);
router.post("/", addHabit);

export default router;
