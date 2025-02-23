import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();
const port = process.env.PORT || 8000;

// Function to get timestamp in Singapore time (UTC+8)
const getSGTTimeStamp = () => {
	const now = new Date();
	const sgtOffset = 8 * 60 * 60 * 1000; // Singapore is UTC+8
	return new Date(now.getTime() + sgtOffset).toLocaleString("en-SG", {
		timeZone: "Asia/Singapore",
	});
};

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log(`[${getSGTTimeStamp()}] MongoDB connection successful`);
	})
	.catch((error) =>
		console.log(
			`[${getSGTTimeStamp()}] ❌ MongoDB Connection Error:`,
			error
		)
	);

app.listen(port, () => {
	console.log(`🚀 Server running at http://localhost:${port}`);
});
