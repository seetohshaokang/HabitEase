"use client";

import { useEffect, useRef, useState } from "react";

export default function HabitVisualization({ habit, logs }) {
	const [weekdayData, setWeekdayData] = useState([]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [heatmapData, setHeatmapData] = useState([]);
	const [tooltip, setTooltip] = useState({
		visible: false,
		text: "",
		x: 0,
		y: 0,
	});
	const heatmapRef = useRef(null);

	useEffect(() => {
		console.log("HabitVisualization received props:", { habit, logs });
		console.log("Logs type:", Array.isArray(logs) ? "Array" : typeof logs);
		console.log("Logs length:", logs?.length || 0);

		if (!logs || logs.length === 0) {
			console.log("No logs to process, returning early");
			return;
		}

		console.log(
			"First few log timestamps:",
			logs.slice(0, 3).map((log) => ({
				timeStamp: log.timeStamp,
				parsedDate: new Date(log.timeStamp).toString(),
				isValid: !isNaN(new Date(log.timeStamp).getTime()),
			}))
		);

		processWeekdayData();
		processMonthlyData();
		processHeatmapData();
	}, [logs]);

	const processWeekdayData = () => {
		console.log("Starting processWeekdayData");
		// Initialise counters for each day of week
		const daysOfWeek = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];

		const data = daysOfWeek.map((day) => ({
			day: day,
			count: 0,
			total: 0,
			percentage: 0,
		}));

		// Count completion for each day of week
		logs.forEach((log) => {
			const date = new Date(log.timeStamp);
			if (isNaN(date.getTime())) {
				console.error(
					"Invalid date in processWeekdayData:",
					log.timeStamp
				);
				return;
			}
			const dayOfWeek = date.getDay();
			data[dayOfWeek].count++;
		});

		// Calculate percentages (out of how many possible of each weekday in the date range)
		if (logs.length > 0) {
			// Get date range
			const dates = logs.map((log) => new Date(log.timeStamp));
			const validDates = dates.filter((date) => !isNaN(date.getTime()));

			if (validDates.length === 0) {
				console.error("No valid dates found in logs");
				return;
			}

			const minDate = new Date(Math.min(...validDates));
			const maxDate = new Date();

			console.log("Date range for weekday data:", {
				minDate: minDate.toISOString(),
				maxDate: maxDate.toISOString(),
			});

			// Count total occurrences of each weekday in date ranges
			let currentDate = new Date(minDate);
			while (currentDate <= maxDate) {
				const dayOfWeek = currentDate.getDay();
				data[dayOfWeek].total++;
				currentDate.setDate(currentDate.getDate() + 1);
			}

			// Calculate percentages
			data.forEach((day) => {
				day.percentage =
					day.total > 0
						? Math.round((day.count / day.total) * 100)
						: 0;
			});
		}

		console.log("Weekday data processed:", data);
		setWeekdayData(data);
	};

	const processMonthlyData = () => {
		console.log("Starting processMonthlyData");
		if (logs.length === 0) {
			console.log("No logs to process for monthly data");
			return;
		}

		// Get the past 6 months
		const months = [];
		const today = new Date();

		for (let i = 5; i >= 0; i--) {
			const month = new Date(
				today.getFullYear(),
				today.getMonth() - i,
				1
			);
			months.push({
				month: month.toLocaleString("default", { month: "short" }),
				year: month.getFullYear(),
				numericMonth: month.getMonth(),
				count: 0,
			});
		}

		console.log("Month buckets created:", months);

		// Count completions for each month
		let matchCount = 0;
		let processedCount = 0;

		logs.forEach((log) => {
			processedCount++;
			try {
				const date = new Date(log.timeStamp);
				if (isNaN(date.getTime())) {
					console.error(
						"Invalid date in processMonthlyData:",
						log.timeStamp
					);
					return;
				}

				console.log(`Log ${processedCount}:`, {
					timeStamp: log.timeStamp,
					parsedDate: date.toString(),
					month: date.getMonth(),
					year: date.getFullYear(),
				});

				const monthIndex = months.findIndex(
					(m) =>
						m.numericMonth === date.getMonth() &&
						m.year === date.getFullYear()
				);

				if (monthIndex >= 0) {
					months[monthIndex].count++;
					matchCount++;
					console.log(
						`  → Matched month at index ${monthIndex}: ${months[monthIndex].month} ${months[monthIndex].year}`
					);
				} else {
					console.log(
						`  → No matching month found for ${date.getMonth()}/${date.getFullYear()}`
					);
				}
			} catch (error) {
				console.error(
					"Error processing log for monthly data:",
					error,
					log
				);
			}
		});

		console.log(
			`Processed ${processedCount} logs, matched ${matchCount} to months`
		);
		console.log("Final monthly data:", months);

		// Check if all counts are zero
		const allZero = months.every((month) => month.count === 0);
		if (allZero) {
			console.warn("WARNING: All monthly counts are zero!");
		}

		setMonthlyData(months);
	};

	const processHeatmapData = () => {
		console.log("Starting processHeatmapData");
		// Create a 6-month heatmap grid (same as github style)
		const startDate = new Date();
		startDate.setDate(1); // First day of current month
		startDate.setMonth(startDate.getMonth() - 5); // Go back 5 months

		const endDate = new Date();
		const data = [];

		// Create an array of all dates in the range
		let currentDate = new Date(startDate);
		while (currentDate <= endDate) {
			data.push({
				date: new Date(currentDate),
				dateStr: currentDate.toISOString().split("T")[0],
				value: null,
			});
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// Map log dates to the date objects
		const logMap = {};
		logs.forEach((log) => {
			const dateObj = new Date(log.timeStamp);
			if (isNaN(dateObj.getTime())) {
				console.error(
					"Invalid date in processHeatmapData:",
					log.timeStamp
				);
				return;
			}

			const dateStr = dateObj.toISOString().split("T")[0];
			// If habit has units, store the value, otherwise just mark as completed
			logMap[dateStr] =
				habit.unit && log.value ? parseFloat(log.value) : true;
		});

		// Update the value for each date
		let matchCount = 0;
		data.forEach((day) => {
			if (logMap[day.dateStr] !== undefined) {
				day.value = logMap[day.dateStr];
				matchCount++;
			}
		});

		console.log(
			`Heatmap: matched ${matchCount} logs to dates out of ${data.length} days`
		);
		setHeatmapData(data);
	};

	console.log("Rendering with state:", {
		weekdayDataLength: weekdayData.length,
		monthlyDataLength: monthlyData.length,
		monthlyData: monthlyData,
	});

	return (
		<div className="space-y-8">
			{/* Full Heatmap with Enhanced Tooltip */}
			<div className="bg-white p-4 rounded-lg shadow">
				<h3 className="text-lg font-medium mb-2">Completion History</h3>
				<p className="text-sm text-gray-500 mb-4">
					Each square represents a day - darker blue squares show
					completed days, with intensity showing values when
					applicable.
				</p>
				<div className="flex flex-wrap gap-1 relative" ref={heatmapRef}>
					{heatmapData.map((day, i) => {
						// Format the date for display
						const dayDate = new Date(day.dateStr);
						const formattedDate = dayDate.toLocaleDateString(
							undefined,
							{
								weekday: "short",
								month: "short",
								day: "numeric",
							}
						);

						// Create meaningful tooltip content
						const tooltipText =
							day.value !== null
								? habit.unit
									? `${formattedDate}: ${day.value} ${habit.unit}`
									: `${formattedDate}: Completed`
								: `${formattedDate}: Not completed`;

						return (
							<div
								key={i}
								className={`w-3 h-3 rounded-sm ${getHeatmapColor(
									day.value,
									habit.unit
								)} hover:ring-2 hover:ring-blue-300 transition-all duration-200 cursor-pointer`}
								onMouseEnter={(e) => {
									// Get position relative to the heatmap container
									const rect =
										e.target.getBoundingClientRect();
									const containerRect =
										heatmapRef.current.getBoundingClientRect();

									setTooltip({
										visible: true,
										text: tooltipText,
										x:
											rect.left -
											containerRect.left +
											rect.width / 2,
										y: -30, // Position just above the heatmap squares
									});
								}}
								onMouseLeave={() =>
									setTooltip({ ...tooltip, visible: false })
								}
							/>
						);
					})}

					{/* Custom Tooltip */}
					{tooltip.visible && (
						<div
							className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap pointer-events-none"
							style={{
								left: `${tooltip.x}px`,
								top: `${tooltip.y}px`,
								transform: "translateX(-50%)",
							}}
						>
							{tooltip.text}
						</div>
					)}
				</div>

				<div className="flex justify-between text-xs text-gray-500 mt-2">
					<span>
						{new Date(heatmapData[0]?.dateStr).toLocaleString(
							"default",
							{
								month: "short",
							}
						)}
					</span>
					<span>
						{new Date(
							heatmapData[heatmapData.length - 1]?.dateStr
						).toLocaleString("default", {
							month: "short",
						})}
					</span>
				</div>
			</div>

			{/* Weekly Pattern */}
			<div className="bg-white p-4 rounded-lg shadow">
				<h3 className="text-lg font-medium mb-2">Weekly Patterns</h3>
				<p className="text-sm text-gray-500 mb-4">
					See which days of the week you're most consistent with -
					longer bars indicate higher completion rates.
				</p>
				<div className="space-y-2">
					{weekdayData.map((day) => (
						<div key={day.day} className="flex items-center">
							<div className="w-24 text-sm">{day.day}</div>
							<div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
								<div
									className="h-full bg-blue-500"
									style={{ width: `${day.percentage}%` }}
								/>
							</div>
							<div className="w-16 text-right text-sm">
								{day.percentage}%
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Monthly Trend */}
			<div className="bg-white p-4 rounded-lg shadow">
				<h3 className="text-lg font-medium mb-2">Monthly Trend</h3>
				<p className="text-sm text-gray-500 mb-4">
					Track your consistency month-by-month - longer bars show
					months with more completions.
				</p>

				<div className="mt-4">
					{monthlyData.length > 0 ? (
						<div className="space-y-3">
							{monthlyData.map((month) => {
								const maxCount =
									Math.max(
										...monthlyData.map((m) => m.count || 0)
									) || 1;
								const widthPercent =
									(month.count / maxCount) * 100;

								return (
									<div
										key={`${month.month}-${month.year}`}
										className="flex items-center"
									>
										<div className="w-12 text-xs text-right pr-2">
											{month.month}
										</div>
										<div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-blue-500 rounded-full transition-all duration-500"
												style={{
													width: `${widthPercent}%`,
												}}
											/>
										</div>
										<div className="w-12 text-xs text-gray-500 pl-2">
											{month.count}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<p className="text-gray-500">
							No monthly data available
						</p>
					)}
				</div>
			</div>

			{/* If habit has units, show value chart */}
			{habit.unit && (
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-lg font-medium mb-2">Value Tracking</h3>
					<p className="text-sm text-gray-500 mb-4">
						Track your {habit.unit} measurements over time - see
						your average and highest values.
					</p>
					<p className="text-gray-500 text-sm">
						Average: {calculateAverage(logs)} {habit.unit}
					</p>
					<p className="text-gray-500 text-sm">
						Highest: {calculateHighest(logs)} {habit.unit}
					</p>
					{/* You could add a more sophisticated chart here with a library like recharts */}
				</div>
			)}
		</div>
	);
}

// Helper function to determine heatmap color
function getHeatmapColor(value, hasUnit) {
	if (value === null) return "bg-gray-100";

	// For habits with units
	if (hasUnit && typeof value === "number") {
		// Simple scale based on value
		if (value > 100) return "bg-green-800";
		if (value > 75) return "bg-green-700";
		if (value > 50) return "bg-green-600";
		if (value > 25) return "bg-green-500";
		return "bg-green-400";
	}

	// For boolean completion
	return "bg-green-500";
}
// Helper to calculate average value for habits with units
function calculateAverage(logs) {
	const valuesWithUnits = logs
		.filter((log) => log.value && !isNaN(parseFloat(log.value)))
		.map((log) => parseFloat(log.value));

	if (valuesWithUnits.length === 0) return 0;

	const sum = valuesWithUnits.reduce((acc, val) => acc + val, 0);
	return Math.round((sum / valuesWithUnits.length) * 10) / 10; // Round to 1 decimal place
}

// Helper to find highest value
function calculateHighest(logs) {
	const valuesWithUnits = logs
		.filter((log) => log.value && !isNaN(parseFloat(log.value)))
		.map((log) => parseFloat(log.value));

	if (valuesWithUnits.length === 0) return 0;

	return Math.max(...valuesWithUnits);
}
