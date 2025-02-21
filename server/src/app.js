import cors from "cors";
import express from "express";
import habitRoutes from "./routes/habitRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/habits", habitRoutes);

export default app;
