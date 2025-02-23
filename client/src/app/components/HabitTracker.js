"use client"; // Ensure it's only rendered in the browser

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Circle } from "lucide-react"; // Icons from `lucide-react`
import { useEffect, useState } from "react";

export default function HabitTracker() {
	const [habits, setHabits] = useState([]);
	const [habitName, setHabitName] = useState("");
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
							Authorization: `Bearer ${token}`, // ✅ Include JWT token
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
			completedDates: [],
			streak: 0,
		};

		try {
			setLoading(true);
			const response = await fetch("http://localhost:8000/api/habits", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // ✅ Include JWT token
				},
				body: JSON.stringify(newHabit),
			});
			if (!response.ok) throw new Error("Failed to add habit");

			const savedHabit = await response.json();
			setHabits([...habits, savedHabit]); // ✅ Append new habit from backend
			setHabitName(""); // Reset input field
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
						Authorization: `Bearer ${token}`, // ✅ Include JWT token
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
						Authorization: `Bearer ${token}`, // ✅ Include JWT token
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
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Habit Tracker</h2>

			{/* Add Habit Form */}
			<div className="flex space-x-2 mb-6">
				<Input
					type="text"
					value={habitName}
					onChange={(e) => setHabitName(e.target.value)}
					placeholder="Enter a new habit"
					disabled={loading}
				/>
				<Button onClick={handleAddHabit} disabled={loading || !token}>
					{loading ? "Adding..." : "Add Habit"}
				</Button>
			</div>

			{/* Habit List */}
			<ul className="space-y-4">
				{habits.map((habit) => (
					<li
						key={habit._id}
						className="flex justify-between items-center bg-gray-100 p-4 rounded"
					>
						<span>{habit.name}</span>
						<div className="flex space-x-2">
							{/* Mark Completed Button */}
							<Button
								variant="outline"
								onClick={() => handleCompleteHabit(habit._id)}
							>
								{Array.isArray(habit.completedDates) &&
								habit.completedDates.includes(
									new Date().toISOString().split("T")[0]
								) ? (
									<CheckCircle className="h-5 w-5 text-green-500" />
								) : (
									<Circle className="h-5 w-5 text-gray-500" />
								)}
							</Button>

							{/* Delete Button */}
							<Button
								variant="destructive"
								onClick={() => handleDeleteHabit(habit._id)}
							>
								Delete
							</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
