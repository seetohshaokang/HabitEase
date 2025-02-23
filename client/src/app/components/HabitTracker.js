"use client"; // Ensure it's only rendered in the browser

import HabitHeatmap from "@/components/HabitHeatmap";
import { useEffect, useState } from "react";

export default function HabitTracker() {
	const [habits, setHabits] = useState([]);
	const [habitName, setHabitName] = useState("");
	const [habitLogo, setHabitLogo] = useState(""); // ✅ Store custom logo
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);

	// ✅ Fetch JWT token from localStorage when component loads
	useEffect(() => {
		const storedToken = localStorage.getItem("userToken");
		if (!storedToken) {
			console.error("No token found. User may not be authenticated.");
			return;
		}
		setToken(storedToken);
	}, []);

	// ✅ Fetch Habits from MongoDB (using JWT authentication)
	useEffect(() => {
		if (!token) return; // Ensure we have a token before fetching
		async function fetchHabits() {
			try {
				const response = await fetch(
					"http://localhost:8000/api/habits",
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error(
						`Error ${response.status}: ${response.statusText}`
					);
				}
				const data = await response.json();
				setHabits(data); // ✅ Update habit state with data from backend
			} catch (error) {
				console.error("Failed to fetch habits:", error);
			}
		}
		fetchHabits();
	}, [token]); // Re-fetch when token is set

	// ✅ Add a new Habit (POST request to backend with JWT)
	const handleAddHabit = async () => {
		if (!habitName.trim() || !token) return;

		const newHabit = {
			name: habitName,
			logo: habitLogo || "🔥", // Default logo if none provided
			completedDates: [],
			streak: 0,
		};

		try {
			setLoading(true);
			const response = await fetch("http://localhost:8000/api/habits", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(newHabit),
			});
			if (!response.ok) throw new Error("Failed to add habit");

			const savedHabit = await response.json();
			setHabits([...habits, savedHabit]); // ✅ Append new habit from backend
			setHabitName("");
			setHabitLogo(""); // ✅ Reset input fields after adding
		} catch (error) {
			console.error("Error adding habit:", error);
		} finally {
			setLoading(false);
		}
	};

	// ✅ Delete a habit (DELETE request to backend with JWT)
	const handleDeleteHabit = async (id) => {
		if (!token) return;
		try {
			const response = await fetch(
				`http://localhost:8000/api/habits/${id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) throw new Error("Failed to delete habit");

			setHabits(habits.filter((habit) => habit._id !== id)); // ✅ Remove from state
		} catch (error) {
			console.error("Error deleting habit:", error);
		}
	};

	// ✅ Mark habit as completed (PUT request to backend with JWT)
	const handleCompleteHabit = async (id) => {
		if (!token) return;
		try {
			const response = await fetch(
				`http://localhost:8000/api/habits/${id}/complete`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok)
				throw new Error("Failed to mark habit as completed");

			// ✅ Update the completed habit in state
			const updatedHabit = await response.json();
			setHabits(
				habits.map((habit) => (habit._id === id ? updatedHabit : habit))
			);
		} catch (error) {
			console.error("Error completing habit:", error);
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
			<h2 className="text-xl font-bold text-center mb-4">Your Habits</h2>

			{/* Habit List */}
			<ul className="space-y-4">
				{/* Example Habit Card */}
				<li className="p-4 bg-gray-100 rounded-md shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
					{/* Habit Info */}
					<div className="flex items-center space-x-2">
						<span className="text-2xl">🔥</span>{" "}
						{/* Example Emoji */}
						<span className="text-lg font-semibold">
							Daily Exercise
						</span>
					</div>

					{/* Heatmap */}
					<div className="w-full overflow-x-auto">
						<HabitHeatmap />
					</div>
				</li>
			</ul>
		</div>
	);
}
