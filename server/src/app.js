import cors from "cors";
import express from "express";
import habitRoutes from "./routes/habitRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Authentication route for generating JWT tokens
app.use("/api/auth", authRoutes);

// Habit tracking APi routes (secured with JWT)
app.use("/api/habits", habitRoutes);

export default app;
