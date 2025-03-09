// components/HabitCard.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logHabit } from "../lib/api";
import LogHabitModal from "./LogHabitModal";
import MiniHeatMap from "./MiniHeatmap";

export default function HabitCard({ habit, onComplete }) {
	const { token } = useAuth();
	const router = useRouter();
	const [isLogging, setIsLogging] = useState(false);
	const [showLogModal, setShowLogModal] = useState(false);

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

	const handleLogHabit = async (habitId, value) => {
		if (isLogging) return;

		try {
			setIsLogging(true);
			await logHabit(token, habitId, value);
			onComplete(); // Refresh habits after logging
		} catch (error) {
			console.error("Error logging habit:", error);
		} finally {
			setIsLogging(false);
		}
	};

	const handleCardClick = () => {
		const habitId = habit._id ? habit._id.toString() : habit._id;
		console.log("Navigating to habit:", habitId);
		router.push(`/habits/${habit._id}`);
	};

	return (
		<>
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
						<div className="text-3xl mb-2">{habit.logo}</div>
						<h3 className="font-semibold text-lg">{habit.name}</h3>
						{habit.streak > 0 && (
							<div className="flex items-center mt-1 text-sm text-orange-500">
								<span className="mr-1">🔥</span>
								<span>
									{habit.streak === 1
										? "1 day streak - just getting started!"
										: habit.streak < 5
										? `${habit.streak} day streak - keep it up!`
										: `${habit.streak} day streak - you're on fire!`}
								</span>
							</div>
						)}
					</div>

					<button
						onClick={(e) => {
							e.stopPropagation();
							if (!completed) {
								setShowLogModal(true);
							}
						}}
						disabled={isLogging || completed}
						className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors
              ${
					completed
						? "bg-green-500 text-white cursor-default"
						: "bg-gray-100 hover:bg-green-100 text-gray-500 hover:text-green-500"
				}`}
					>
						{completed ? "✓" : "+"}
					</button>
				</div>

				<div className="mt-3">
					<p className="text-sm text-gray-500 mb-1">
						{completed
							? `✓ Completed today - great job!`
							: "Ready to track today's progress"}
						{habit.unit && (
							<span className="ml-1">
								{`(You track this in ${habit.unit})`}
							</span>
						)}
					</p>

					{/* Add Mini Heatmap with better description */}
					<div className="mt-2">
						<p className="text-xs text-gray-400 mb-1">
							Your last 14 days:
						</p>
						<MiniHeatMap logs={habit.logs || []} />
					</div>
				</div>
			</div>

			{/* Log Habit Modal */}
			{showLogModal && (
				<LogHabitModal
					habit={habit}
					onComplete={handleLogHabit}
					onClose={() => setShowLogModal(false)}
				/>
			)}
		</>
	);
}
