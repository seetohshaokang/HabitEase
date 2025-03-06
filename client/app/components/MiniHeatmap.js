"use client";

import { useEffect, useState } from "react";

export default function MiniHeatMap({ logs }) {
	const [heatmapData, setHeatmapData] = useState([]);
	useEffect(() => {
		if (!logs || logs.length === 0) {
			setHeatmapData(generateEmptyHeatmap());
			return;
		}

		// Process logs to generate heatmap data
		generateHeatmapData(logs);
	}, [logs]);

	const generateEmptyHeatmap = () => {
		// Create empty 2-week heatmap (14 days)
		const data = [];
		for (let i = 13; i >= 0; i--) {
			// Last 2 weeks for mini heatmap hence 13 days

			const date = new Date();
			date.setDate(date.getDate() - i);
			data.push({
				date: date.toISOString().split("T")[0],
				value: null,
			});
		}
		return data;
	};

	const generateHeatmapData = (logs) => {
		// Create heatmap with 14 days
		const data = generateEmptyHeatmap();

		// Map logs to dates
		const logDates = {};
		logs.forEach((log) => {
			const dateStr = new Date(log.timeStamp).toISOString().split("T")[0];
			logDates[dateStr] = log.value || true; // Store value if available, otherwise just mark completed
		});

		// Merge lod converted dates into empty heatmap
		const mergedData = data.map((day) => ({
			...day,
			value: logDates[day.date] || null,
		}));

		setHeatmapData(mergedData);
	};

	// Function to determine cell color based on completion
	const getCellColor = (value) => {
		if (value === null) return "bg-gray-100";

		// If value is a number (for habits with units), adjust intensity based on value
		if (typeof value === "number") {
			// Simple scale: Higher values = darker green
			// Can be adjusted based on specific habit's typical values
			if (value > 100) return "bg-green-800";
			if (value > 75) return "bg-green-700";
			if (value > 50) return "bg-green-600";
			if (value > 25) return "bg-green-500";
			return "bg-green-400";
		}

		// For boolean completion
		return "bg-green-500";
	};

	return (
		<div className="flex flex-wrap gap-1 mt-2">
			{heatmapData.map((day, index) => (
				<div
					key={index}
					className={`w-3 h-3 rounded-sm ${getCellColor(day.value)}`}
					title={
						data.date +
						(day.value ? "- Completed" : " - Not completed")
					}
				></div>
			))}
		</div>
	);
}
