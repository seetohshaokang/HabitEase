import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();
const port = process.env.PORT || 8000;

// ✅ Function to get timestamp in Singapore Time (SGT)
const getSGTTimeStamp = () => {
	return new Intl.DateTimeFormat("en-SG", {
		timeZone: "Asia/Singapore",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false, // ✅ Ensures 24-hour format
	}).format(new Date());
};

// ✅ MongoDB Connection
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log(`[${getSGTTimeStamp()}] ✅ MongoDB connection successful`);
	})
	.catch((error) =>
		console.log(
			`[${getSGTTimeStamp()}] ❌ MongoDB Connection Error:`,
			error
		)
	);

// ✅ Start Express Server with SGT timestamp
app.listen(port, () => {
	console.log(
		`[${getSGTTimeStamp()}] 🚀 Server running at http://localhost:${port}`
	);
});
