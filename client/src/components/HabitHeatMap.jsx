import { endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

/**
 * GitHub-Style Responsive Heatmap for Habit Tracking
 * @param {Array} completedDates - Array of completed habit dates (ISO strings).
 */
export default function HabitHeatmap({ completedDates = [] }) {
	const [habitData, setHabitData] = useState([]);
	const [visibleWeeks, setVisibleWeeks] = useState(52); // Default to full year
	const heatmapRef = useRef(null);

	// Effect to adjust visible weeks based on browser width
	useEffect(() => {
		const handleResize = () => {
			if (heatmapRef.current) {
				const width = heatmapRef.current.offsetWidth;
				const newVisibleWeeks = Math.max(
					12,
					Math.floor((width - 50) / 13)
				); // Adjust weeks based on width
				setVisibleWeeks(newVisibleWeeks);
			}
		};

		handleResize(); // Initial check
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Convert completedDates into required format
	useEffect(() => {
		const formattedData = completedDates.map((date) => ({
			date,
			count: 1,
		}));
		setHabitData(formattedData);
	}, [completedDates]);

	const toggleHabit = (date) => {
		const newData = [...habitData];
		const existingIndex = newData.findIndex((item) => item.date === date);

		if (existingIndex >= 0) {
			newData.splice(existingIndex, 1);
		} else {
			newData.push({ date, count: 1 });
		}

		setHabitData(newData);
	};

	const today = new Date();
	const endDate = endOfWeek(today);
	const startDate = startOfWeek(subWeeks(endDate, visibleWeeks - 1));

	// Weekday Labels
	const weekdayLabels = ["Mon", "Wed", "Fri"];

	return (
		<div className="bg-white p-4 rounded-lg shadow">
			<h2 className="text-xl font-semibold mb-2">
				Habit Tracking Heatmap
			</h2>

			{/* Scrollable Heatmap Container */}
			<div className="relative overflow-x-auto pb-2" ref={heatmapRef}>
				{/* Fixed Left Day Labels */}
				<div
					className="sticky left-0 z-10 bg-white flex flex-col justify-between text-xs text-gray-400 pt-2 pb-1 pr-2"
					style={{ height: "100%", float: "left" }}
				>
					{weekdayLabels.map((day) => (
						<span
							key={day}
							style={{
								height: "33.33%",
								display: "flex",
								alignItems: "center",
							}}
						>
							{day}
						</span>
					))}
				</div>

				{/* Heatmap Grid with Horizontal Scrolling */}
				<div
					style={{
						width: `${visibleWeeks * 13}px`,
						paddingLeft: "40px",
					}}
				>
					<CalendarHeatmap
						startDate={startDate}
						endDate={endDate}
						values={habitData}
						classForValue={(value) => {
							if (!value) return "color-empty";
							return `color-scale-${value.count}`;
						}}
						onClick={(value) => value && toggleHabit(value.date)}
						titleForValue={(value) => {
							if (!value) return "";
							return `${format(
								new Date(value.date),
								"MMM d, yyyy"
							)}: ${value.count ? "Completed" : "Not completed"}`;
						}}
						transformDayElement={(element, value, index) =>
							React.cloneElement(element, {
								rx: 2,
								ry: 2,
								width: 10,
								height: 10,
								x: element.props.x + 1,
								y: element.props.y + 1,
							})
						}
						showWeekdayLabels={false}
					/>
				</div>
			</div>

			{/* Horizontal Scrollbar */}
			<div className="overflow-x-auto mt-2">
				<div style={{ width: `${visibleWeeks * 13}px` }}></div>
			</div>
		</div>
	);
}
