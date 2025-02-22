"use client"; // Ensure it's only rendered in the browser

import {
	addHabit,
	completeHabit,
	deleteHabit,
	getHabits,
} from "@/app/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Ensure `input.jsx` exists in `components/ui`
import { CheckCircle, Circle } from "lucide-react"; // Icons from `lucide-react`
import { useEffect, useState } from "react";

export default function HabitTracker() {
	const [habits, setHabits] = useState([]);
	const [habitName, setHabitName] = useState("");

	// Load Habits on first render
	useEffect(() => {
		setHabits(getHabits());
	}, []);

	// Add a new Habit
	const handleAddHabit = () => {
		if (!habitName.trim()) return;

		const newHabit = {
			id: Date.now().toString(),
			name: habitName,
			completedDates: [],
			streak: 0,
		};

		addHabit(newHabit);
		setHabits([...habits, newHabit]);
		setHabitName(""); // Reset input
	};

	// Delete a habit
	const handleDeleteHabit = (id) => {
		deleteHabit(id);
		setHabits(habits.filter((habit) => habit.id !== id));
	};

	// Mark habit as completed
	const handleCompleteHabit = (id) => {
		completeHabit(id);
		setHabitName(getHabits()); // Reload updated habits
	};

	return (
		<div className="p-6">
			<h2 className="text-2-xl font-bold mb-4">Habit Tracker</h2>

			{/*Add Habit Form*/}
			<div className="flex space-x-2 mb-6">
				<Input
					type="text"
					value={habitName}
					onChange={(e) => setHabitName(e.target.value)}
					placeholder="Enter a new habit"
				></Input>
				<Button onClick={handleAddHabit}>Add Habit</Button>
			</div>

			{/*Habit List*/}
			<ul className="space-y-4">
				{habits.map((habit) => (
					<li
						key={habit.id}
						className="flex justify-between items-center bg-gray-100 p-4 rounded"
					>
						<span>{habit.name}</span>
						<div className="flex space-x-2">
							{/*Mark Completed Button*/}
							<Button
								variant="outline"
								onClick={() => handleCompleteHabit(habit.id)}
							>
								{habit.completedDates.includes(
									new Date().toISOString().split("T")[0]
								) ? (
									<CheckCircle className="h-5 w-5 text-green-500" />
								) : (
									<Circle className="h-5 w-5 text-gray-500" />
								)}
							</Button>
							{/* Delete Button*/}
							<Button
								variant="destructive"
								onClick={() => handleDeleteHabit(habit.id)}
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
