import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const port = process.env.PORT || 5000;

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
		console.log(
			`[${getSGTTimeStamp()}] 🚀 Server is running on port ${port}`
		);
	})
	.catch((error) =>
		console.log(
			`[${getSGTTimeStamp()}] ❌ MongoDB Connection Error:`,
			error
		)
	);
