/**
 * Custom GitHub-style Heatmap Component (Maximizes Card Space)
 * @param {Array} completedDates - Array of completed habit dates (ISO strings).
 */
export default function HabitHeatmap({ completedDates = [] }) {
	const today = new Date();
	const totalDays = 60; // Extend to last 60 days for a wider grid
	const columns = 10; // Number of columns for better card fit
	const rows = Math.ceil(totalDays / columns); // Automatically adjust rows

	// Generate last 60 days dynamically
	const last60Days = [...Array(totalDays)].map((_, i) => {
		const date = new Date();
		date.setDate(today.getDate() - i);
		return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
	});

	// Convert completed dates into a grid structure
	const data = [];
	for (let i = 0; i < rows; i++) {
		data[i] = last60Days
			.slice(i * columns, (i + 1) * columns)
			.map((date) => (completedDates.includes(date) ? 1 : 0));
	}

	// Function to determine color intensity
	const getColor = (value) => {
		if (value >= 5) return "bg-green-700"; // High activity
		if (value >= 3) return "bg-green-500"; // Medium activity
		if (value >= 1) return "bg-green-300"; // Low activity
		return "bg-gray-200"; // Not completed
	};

	return (
		<div className="flex justify-center">
			<div className="grid grid-cols-10 gap-[2px] p-2 bg-gray-100 rounded-lg">
				{data.flat().map((value, index) => (
					<div
						key={index}
						className={`w-6 h-6 sm:w-7 sm:h-7 rounded ${getColor(
							value
						)}`}
						title={`Day ${index + 1} - Completed: ${
							value ? "Yes" : "No"
						}`}
					></div>
				))}
			</div>
		</div>
	);
}
