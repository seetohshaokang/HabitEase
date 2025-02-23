export default function HabitHeatmap({ completedDates = [] }) {
	const totalDays = 365;
	const rows = 7; // Sun-Sat (top-down)
	const columns = Math.ceil(totalDays / rows); // 52 weeks (left-right)
	const squareSize = 16; // Keep each square fixed

	// Generate a dummy dataset (No state handling, just styling)
	const last365Days = [...Array(totalDays)]
		.map((_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return {
				date: date.toISOString().split("T")[0], // Format: YYYY-MM-DD
				completed: completedDates.includes(date),
			};
		})
		.reverse(); // Ensure the latest date is on the far right

	// Ensure the grid starts on a Sunday
	const firstDay = new Date(last365Days[0].date).getDay(); // 0 = Sunday
	const emptyCells = firstDay === 0 ? 0 : firstDay;
	const paddedDays = [...Array(emptyCells).fill(null), ...last365Days];

	// Function to determine grid color based on completion
	const getColor = (completed) =>
		completed ? "bg-green-500" : "bg-gray-200";

	return (
		<div className="w-full flex flex-col items-start">
			{/* Scrollable container for heatmap */}
			<div className="relative overflow-x-auto border rounded-lg bg-gray-100 p-2">
				<div
					className="grid gap-[3px] min-w-[700px] md:min-w-[500px] sm:min-w-[350px]"
					style={{
						gridTemplateColumns: `repeat(${columns}, ${squareSize}px)`, // Weeks (left-right)
						gridTemplateRows: `repeat(${rows}, ${squareSize}px)`, // Days (Sun-Sat)
					}}
				>
					{/* Render squares with unique keys */}
					{paddedDays.map((day, index) => (
						<div
							key={day ? `day-${day.date}` : `empty-${index}`} // Ensure unique keys
							className={`w-[${squareSize}px] h-[${squareSize}px] rounded cursor-pointer ${
								day ? getColor(day.completed) : "opacity-0"
							}`}
							title={
								day
									? `${day.date}: ${
											day.completed
												? "Completed"
												: "Not Completed"
									  }`
									: ""
							}
						></div>
					))}
				</div>
			</div>
		</div>
	);
}
