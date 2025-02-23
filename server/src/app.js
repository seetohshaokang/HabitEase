import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoute.js";
import habitRoutes from "./routes/habitRoute.js";

const app = express();

app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:8000"], // ✅ Allow frontend requests from both ports
		credentials: true, // ✅ Allow cookies & auth headers
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow HTTP methods
		allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed headers
	})
);
app.options("*", cors()); // Handle preflight CORS requests globally

app.use(express.json());

// Authentication route for generating JWT tokens
app.use("/api/auth", authRoutes);

// Habit tracking API routes (secured with JWT)
app.use("/api/habits", habitRoutes);

export default app;
