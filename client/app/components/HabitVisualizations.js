"use client";

import { useEffect, useState } from "react";

export default function HabitVisualization({ habit, logs }) {
	const [weekdayData, setWeekdayData] = useState([]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [heatmapData, setHeatmapData] = useState([]);

	useEffect(() => {
		if (!logs || logs.length === 0) return;

		processWeekdayData();
		processMonthlyData();
		processHeatmapData();
	}, [logs]);

	const processWeekdayData = () => {
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
			const dayOfWeek = date.getDay();
			data[dayOfWeek].count++;
		});

		// Calculate percentages (out of how many possible of each weekday in the date range)
		if (logs.length > 0) {
			// Get date range
			const dates = logs.map((log) => new Date(log.timeStamp));
			const minDate = new Date(Math.min(...dates));
			const maxDate = new Date();

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
		setWeekdayData(data);
	};

	const processMonthlyData = () => {
		if (logs.length === 0) return;

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

		// Count completions for each month
		logs.forEach((log) => {
			const date = new Date(log.timeStamp);
			const monthIndex = months.findIndex(
				(m) =>
					m.numericMonth === date.getMonth() &&
					m.year === date.getFullYear()
			);

			if (monthIndex >= 0) {
				months[monthIndex].count++;
			}
		});

		setMonthlyData(months);
	};

	const processHeatmapData = () => {
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
			const dateStr = new Date(log.timeStamp).toISOString().split("T")[0];
			// If habit has units, store the value, otherwise just mark as completed
			logMap[dateStr] =
				habit.unit && log.value ? parseFloat(log.value) : true;
		});

		// Update the value for each date
		data.forEach((day) => {
			if (logMap[day.dateStr] !== undefined) {
				day.value = logMap[day.dateStr];
			}
		});

		setHeatmapData(data);
	};

	return (
		<div className="space-y-8">
			{/* Full Heatmap (like Github contributions) */}
			<div className="bg-white p-4 rounded-lg shadow">
				<h3 className="text-lg font-medium mb-4">Completion History</h3>
				<div className="flex flex-wrap gap-1">
					{heatmapData.map((day, i) => (
						<div
							key={i}
							className={`w-3 h-3 rounded-sm ${getHeatmapColor(
								day.value,
								habit.unit
							)}`}
							title={`${day.dateStr}: ${
								day.value !== null
									? habit.unit
										? `${day.value} ${habit.unit}`
										: "Completed"
									: "Not completed"
							}`}
						/>
					))}
				</div>
				<div className="flex justify-between text-xs text-gray-500 mt-2">
					<span>
						{heatmapData[0]?.date.toLocaleString("default", {
							month: "short",
						})}
					</span>
					<span>
						{heatmapData[
							heatmapData.length - 1
						]?.date.toLocaleString("default", { month: "short" })}
					</span>
				</div>
			</div>

			{/* Weekly Pattern */}
			<div className="bg-white p-4 rounded-lg shadow">
				<h3 className="text-lg font-medium mb-4">Weekly Patterns</h3>
				<div className="spcce-y-2">
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

			<div className="bg-white p-4 rounded-lg shadow">
				<h3 className="text-lg font-medium mb-4">Monthly Trend</h3>
				<div className="h-40 flex items-end justify-between">
					{monthlyData.map((month) => (
						<div
							key={month.month}
							className="flex flex-col items-center"
						>
							<div
								className="w-8 bg-blue-500 rounded-t"
								style={{
									height: `${
										(month.count /
											Math.max(
												...monthlyData.map(
													(m) => m.count || 1
												)
											)) *
										100
									}%`,
								}}
							></div>
							<div className="mt-2 text-xs">{month.month}</div>
						</div>
					))}
				</div>
			</div>

			{/* If habit has units, show value chart */}
			{habit.unit && (
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-lg font-medium mb-4">Value Tracking</h3>
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
