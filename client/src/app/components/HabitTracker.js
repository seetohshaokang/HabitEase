"use client"; // Ensure it's only rendered in the browser

import HabitHeatmap from "@/components/HabitHeatmap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react"; // Icons from `lucide-react`
import { useEffect, useState } from "react";

export default function HabitTracker() {
	const [habits, setHabits] = useState([]);
	const [habitName, setHabitName] = useState("");
	const [habitLogo, setHabitLogo] = useState("");
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState(null);

	// ✅ Wait for `AuthWrapper.js` to set the token in localStorage
	useEffect(() => {
		const storedToken = localStorage.getItem("userToken");

		if (!storedToken) {
			console.warn("No token found in localStorage yet.");
			return; // Don't fetch habits until token exists
		}

		console.log("JWT Token found:", storedToken);
		setToken(storedToken);
	}, []);

	// ✅ Fetch Habits from MongoDB (Wait for `token` before fetching)
	useEffect(() => {
		if (!token) return; // ✅ Don't fetch until token is available

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
				console.log("Fetched habits:", data);
				setHabits(data);
			} catch (error) {
				console.error("Failed to fetch habits:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchHabits();
	}, [token]); // ✅ Run only when `token` is set

	// ✅ Add a new Habit (POST request to backend)
	const handleAddHabit = async () => {
		if (!habitName.trim() || !token) return;

		const newHabit = {
			name: habitName,
			logo: habitLogo || "🔥",
			completedRecords: [],
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
			setHabits([...habits, savedHabit]);
			setHabitName("");
			setHabitLogo("");
		} catch (error) {
			console.error("Error adding habit:", error);
		} finally {
			setLoading(false);
		}
	};

	// ✅ Mark habit as completed
	const handleCompleteHabit = async (id) => {
		if (!token) return;
		try {
			const response = await fetch(
				`http://localhost:8000/api/habits/${id}/complete`,
				{
					method: "PUT",
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (!response.ok)
				throw new Error("Failed to mark habit as completed");

			const updatedHabit = await response.json();
			setHabits(
				habits.map((habit) => (habit._id === id ? updatedHabit : habit))
			);
		} catch (error) {
			console.error("Error completing habit:", error);
		}
	};

	if (loading) {
		return (
			<div className="text-center text-gray-500">Loading habits...</div>
		);
	}

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
				/>
				<Input
					type="text"
					value={habitLogo}
					onChange={(e) => setHabitLogo(e.target.value)}
					placeholder="Enter emoji or image URL"
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
						className="flex flex-col bg-gray-100 p-4 rounded"
					>
						<div className="flex items-center space-x-2">
							<span className="text-2xl">{habit.logo}</span>
							<span className="text-lg font-semibold">
								{habit.name}
							</span>
						</div>

						<HabitHeatmap
							completedRecords={habit.completedRecords}
						/>

						{/* Action Buttons */}
						<div className="flex space-x-2 mt-2">
							<Button
								variant="outline"
								onClick={() => handleCompleteHabit(habit._id)}
							>
								<CheckCircle className="h-5 w-5 text-green-500" />
							</Button>
							<Button
								variant="destructive"
								onClick={() =>
									setHabits(
										habits.filter(
											(h) => h._id !== habit._id
										)
									)
								}
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
