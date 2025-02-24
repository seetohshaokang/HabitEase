"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; // ✅ Import Plus icon for Add button
import { useEffect, useState } from "react";
import HabitForm from "./HabitForm"; // ✅ Handles form inside modal
import HabitList from "./HabitList"; // ✅ Renders habits list

export default function HabitTracker() {
	const [habits, setHabits] = useState([]);
	const [token, setToken] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Controls modal visibility

	// ✅ Fetch JWT token
	useEffect(() => {
		const storedToken = localStorage.getItem("userToken");
		if (!storedToken) return;
		setToken(storedToken);
	}, []);

	// ✅ Fetch habits from API
	useEffect(() => {
		if (!token) return;
		async function fetchHabits() {
			try {
				const response = await fetch(
					"http://localhost:8000/api/habits",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				if (!response.ok) throw new Error("Failed to fetch habits");
				const data = await response.json();
				setHabits(data);
			} catch (error) {
				console.error(error);
			}
		}
		fetchHabits();
	}, [token]);

	// ✅ Add a new habit
	const handleAddHabit = async (habit) => {
		if (!token) return;
		try {
			const response = await fetch("http://localhost:8000/api/habits", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					...habit,
					completedRecords: [],
					streak: 0,
				}),
			});
			if (!response.ok) throw new Error("Failed to add habit");
			const savedHabit = await response.json();
			setHabits([...habits, savedHabit]);
		} catch (error) {
			console.error(error);
		} finally {
			setIsModalOpen(false); // ✅ Close modal after adding habit
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md">
			{/* ✅ Add Habit Button */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Habit Tracker</h2>
				<Button
					onClick={() => setIsModalOpen(true)}
					className="bg-emerald-400 hover:bg-teal-500 flex items-center space-x-2 px-4 py-2 rounded"
				>
					<Plus className="h-5 w-5" />
					<span>Add Habit</span>
				</Button>
			</div>

			{/* ✅ Habit List */}
			<HabitList habits={habits} />

			{/* ✅ Modal for Adding Habit */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
						<h2 className="text-xl font-bold text-gray-800 mb-4">
							Add New Habit
						</h2>
						<HabitForm onAddHabit={handleAddHabit} />
						<Button
							onClick={() => setIsModalOpen(false)}
							className="w-full mt-2 bg-red-500 hover:bg-red-600"
						>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
