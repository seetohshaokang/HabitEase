"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logHabit } from "../lib/api";

export default function Habitcard({ habit, onComplete }) {
	const { token } = useAuth();
	const router = useRouter();
	const [isLogging, setIsLogging] = useState(false);
	const [showUnitInput, setShowUniInput] = useState(false);
	cosnt[(unitValue, setUnitValue)] = useState("");

	// Check if habit was completed today
	const isCompletedToday = () => {
		if (!habit.logs || habit.logs.length === 0) return false;

		const today = new Date().toISOString().split("T")[0];
		return habit.logs.some((log) => {
			const logDate = new Date(log.timeStamp).toISOString().split("T")[0];
			return logDate === today;
		});
	};

	const completed = isCompletedToday();

	const handleLogHabit = async () => {
		if (isLogging) return; // Now matches the state variable name

		// If this habit has a unit define and we're not showing the input yet
		if (habit.unit && !showUnitInput && !completed) {
			setShowUniInput(true);
			return;
		}

		try {
			setIsLogging(true);
			// Pass the unit value if entered, otherwise null
			const value = unitValue.trim() !== "" ? unitValue : null;
			await logHabit(token, habit._id, value);
			setShowUnitInput(false);
			setUnitvalue("");
			onComplete(); // Refresh habits after logging
		} catch (error) {
			console.error("Error logging habit:", error);
		} finally {
			setIsLogging(false);
		}
	};

	const handleCardClick = () => {
		router.push(`/habits/${habit._id}`);
	};

	return (
		<div
			className={`rounded-lg p-4 shadow-md transition-all cursor-pointer
                ${
					completed
						? "bg-green-50 border-green-200"
						: "bg-white border-gray-200"
				} 
                border hover:shadow-lg`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1" onClick={handleCardClick}>
					<div className="text-3xl mb-2">{habit.logo}</div>{" "}
					{/* Changed from log to logo */}
					<h3 className="font-semibold text-lg">{habit.name}</h3>
					{habit.streak > 0 && (
						<div className="flex items-center mt-1 text-sm text-orange-500">
							<span className="mr-1">🔥</span>
							<span>{habit.streak} day streak</span>
						</div>
					)}
				</div>

				{showUnitInput && habit.unit ? (
					<div
						className="flex items-center"
						onClick={(e) => e.stopPropagation()}
					>
						<input
							type="text"
							value={unitValue}
							onChange={handleUnitInputChange}
							onKeyDown={handleUnitInputKeyDown}
							placeholder={`Enter ${habit.unit}`}
							className="border rounded px-2 py-2 text-sm mr-2 w-16"
							autoFocus
						/>
						<button
							onClick={handleLogHabit}
							className="rounded-full w-10 h-10 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600"
						>
							✓
						</button>
					</div>
				) : (
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleLogHabit();
						}}
						disabled={isLogging || completed} // Now matches the state variable name
						className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors
                        ${
							completed
								? "bg-green-500 text-white cursor-default"
								: "bg-gray-100 hover:bg-green-100 text-gray-500 hover:text-green-500"
						}`}
					>
						{completed ? "✓" : "+"}
					</button>
				)}
			</div>

			<div className="mt-3 text-sm text-gray-500">
				{completed ? `Completed today` : "Not completed today"}
				{habit.unit && (
					<span className="ml-1">
						{habit.unit && "(Tracks in " + habit.unit + ")"}
					</span>
				)}
			</div>
		</div>
	);
}
