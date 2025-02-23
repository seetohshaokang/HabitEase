import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function HabitHeatmap({ completedDates = [] }) {
	const heatmapRef = useRef(null);

	useEffect(() => {
		// Dimensions
		const totalDays = 365;
		const rows = 7; // 7 rows for days of the week (Sun-Sat)
		const columns = Math.ceil(totalDays / rows); // ~52 weeks
		const squareSize = 15; // Size of each square
		const gapSize = 2; // Space between squares
		const width = columns * (squareSize + gapSize);
		const height = rows * (squareSize + gapSize) + 40; // Increased height for month labels
		const today = new Date();

		// Format Data
		const last365Days = [...Array(totalDays)]
			.map((_, i) => {
				const date = new Date();
				date.setDate(today.getDate() - i);
				return {
					date: date.toISOString().split("T")[0],
					count: completedDates.includes(
						date.toISOString().split("T")[0]
					)
						? 1
						: 0,
					month: date.getMonth(),
					day: date.getDay(),
				};
			})
			.reverse();

		// Adjust first-day alignment
		const firstDay = new Date(last365Days[0].date).getDay(); // 0 = Sunday
		const emptyCells = firstDay === 0 ? 0 : firstDay;
		const paddedDays = [...Array(emptyCells).fill(null), ...last365Days];

		// Remove existing SVG before re-rendering
		d3.select(heatmapRef.current).select("svg").remove();

		// Create SVG container with extra padding
		const svg = d3
			.select(heatmapRef.current)
			.append("svg")
			.attr("width", width + 50) // Extra space for labels
			.attr("height", height + 50) // ✅ Extra height for month labels
			.append("g")
			.attr("transform", "translate(40, 40)"); // Move heatmap down to prevent cutoff

		// Color Scale (GitHub style)
		const colorScale = d3
			.scaleLinear()
			.domain([0, 1, 3, 5])
			.range(["#ebedf0", "#9be9a8", "#40c463", "#216e39"]);

		// Append squares (cells)
		svg.selectAll(".day-square")
			.data(paddedDays)
			.enter()
			.append("rect")
			.attr("x", (_, i) => Math.floor(i / rows) * (squareSize + gapSize))
			.attr("y", (_, i) => (i % rows) * (squareSize + gapSize))
			.attr("width", squareSize)
			.attr("height", squareSize)
			.attr("rx", 3)
			.attr("ry", 3)
			.attr("fill", (d) => (d ? colorScale(d.count) : "transparent"))
			.attr("stroke", "#333")
			.attr("stroke-width", 0.3);

		// **✅ FIX: Improve Month Label Placement (Only at the first Sunday of the month)**
		const monthLabels = svg
			.append("g")
			.attr("transform", "translate(0,-5)");
		let prevMonth = -1;
		let monthPositions = new Map(); // ✅ Store correct placement per month

		paddedDays.forEach((day, i) => {
			const col = Math.floor(i / rows);
			// ✅ Only place a label when the first Sunday of the month is reached
			if (
				day &&
				day.month !== prevMonth &&
				!monthPositions.has(day.month) &&
				day.day === 0
			) {
				monthLabels
					.append("text")
					.attr("x", col * (squareSize + gapSize) + squareSize / 2) // ✅ Center label in week
					.attr("y", -10) // ✅ Adjusted position slightly downward
					.attr("text-anchor", "middle")
					.attr("fill", "#9e9e9e")
					.attr("font-size", "12px")
					.text(
						new Date(2025, day.month, 1).toLocaleString("default", {
							month: "short",
						})
					);

				monthPositions.set(day.month, true); // ✅ Prevent duplicate labels
				prevMonth = day.month;
			}
		});

		// Add Day Labels
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		svg.selectAll(".day-label")
			.data(days)
			.enter()
			.append("text")
			.attr("x", -10)
			.attr("y", (_, i) => i * (squareSize + gapSize) + squareSize / 2)
			.attr("text-anchor", "end")
			.attr("fill", "#9e9e9e")
			.attr("font-size", "12px")
			.attr("dy", "0.3em")
			.text((d) => d);
	}, [completedDates]);

	return (
		<div className="w-full overflow-x-auto bg-gray-900 p-4 rounded-lg">
			<div ref={heatmapRef}></div>
		</div>
	);
}
