import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function HabitHeatmap({ completedRecords = [] }) {
	const heatmapRef = useRef(null);

	useEffect(() => {
		const today = new Date();
		const totalDays = 365;
		const rows = 7; // 7 rows for days of the week (Sun-Sat)
		const columns = Math.ceil(totalDays / rows); // ~52 weeks
		const squareSize = 15; // ✅ Fixed size for consistency
		const gapSize = 1; // ✅ Keeps proper spacing
		const maxColumns = 52; // ✅ Maximum weeks (1 year)
		const width = maxColumns * (squareSize + gapSize); // ✅ Fixed width, prevents overexpansion
		const height = rows * (squareSize + gapSize) + 20; // ✅ Fixed height, prevents vertical scrolling

		// ✅ Convert completedRecords to a Set for fast lookup
		const completedSet = new Set(
			completedRecords.map((record) => record.date)
		);

		// ✅ Generate last 365 days dynamically
		const last365Days = [...Array(totalDays)]
			.map((_, i) => {
				const date = new Date();
				date.setDate(today.getDate() - i);
				const dateString = date.toISOString().split("T")[0];

				return {
					date: dateString,
					count: completedSet.has(dateString) ? 1 : 0,
					month: date.getMonth(),
					day: date.getDay(),
				};
			})
			.reverse();

		// ✅ Adjust first-day alignment
		const firstDay = new Date(last365Days[0].date).getDay(); // 0 = Sunday
		const emptyCells = firstDay === 0 ? 0 : firstDay;
		const paddedDays = [...Array(emptyCells).fill(null), ...last365Days];

		// ✅ Remove existing SVG before re-rendering
		d3.select(heatmapRef.current).select("svg").remove();

		// ✅ Create SVG container
		const svg = d3
			.select(heatmapRef.current)
			.append("svg")
			.attr("width", width + 50) // ✅ Fixed width for consistent scrolling
			.attr("height", height + 40) // ✅ Increased height to fit day labels
			.append("g")
			.attr("transform", "translate(40, 20)");

		// ✅ Define Color Scale (GitHub style)
		const colorScale = d3
			.scaleLinear()
			.domain([0, 1]) // 0 = not completed, 1 = completed
			.range(["#1b1f23", "#40c463"]); // Dark background → Green

		// ✅ Append squares (cells)
		svg.selectAll(".day-square")
			.data(paddedDays)
			.enter()
			.append("rect")
			.attr("x", (_, i) => Math.floor(i / rows) * (squareSize + gapSize))
			.attr("y", (_, i) => (i % rows) * (squareSize + gapSize) + 15) // ✅ Prevents overlap with labels
			.attr("width", squareSize)
			.attr("height", squareSize)
			.attr("rx", 2)
			.attr("ry", 2)
			.attr("fill", (d) => (d ? colorScale(d.count) : "#1b1f23")) // ✅ Background color matches GitHub style
			.attr("stroke", "#0d1117")
			.attr("stroke-width", 0.2);

		// ✅ Month Labels (Ensure only one per month)
		const monthLabels = svg
			.append("g")
			.attr("transform", "translate(0,-5)");
		let prevMonth = -1;
		let monthPositions = new Map();

		paddedDays.forEach((day, i) => {
			const col = Math.floor(i / rows);
			if (
				day &&
				day.month !== prevMonth &&
				!monthPositions.has(day.month) &&
				day.day === 0
			) {
				monthLabels
					.append("text")
					.attr("x", col * (squareSize + gapSize) + squareSize / 2)
					.attr("y", -5)
					.attr("text-anchor", "middle")
					.attr("fill", "#9e9e9e")
					.attr("font-size", "12px")
					.text(
						new Date(2025, day.month, 1).toLocaleString("default", {
							month: "short",
						})
					);

				monthPositions.set(day.month, true);
				prevMonth = day.month;
			}
		});

		// ✅ Day Labels (Left side of heatmap)
		const days = ["S", "M", "T", "W", "T", "F", "S"];
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
	}, [completedRecords]); // ✅ Re-run effect when `completedRecords` change

	return (
		<div
			className="w-full max-w-4xl overflow-x-auto bg-[#0d1117] p-4 rounded-lg scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
			style={{
				scrollbarColor: "#4a5568 #1a202c",
				height: "auto", // ✅ Allow proper height calculation
				whiteSpace: "nowrap", // ✅ Prevents breaking onto a new line
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div ref={heatmapRef}></div>
		</div>
	);
}
