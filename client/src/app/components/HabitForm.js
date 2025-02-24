import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HabitForm({ onAddHabit }) {
	const [habitName, setHabitName] = useState("");
	const [habitLogo, setHabitLogo] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!habitName.trim()) return;
		onAddHabit({ name: habitName, logo: habitLogo || "🔥" });
		setHabitName("");
		setHabitLogo("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col space-y-3">
			<Input
				type="text"
				value={habitName}
				onChange={(e) => setHabitName(e.target.value)}
				placeholder="Enter habit name"
			/>
			<Input
				type="text"
				value={habitLogo}
				onChange={(e) => setHabitLogo(e.target.value)}
				placeholder="Enter emoji or image URL"
			/>
			<Button type="submit" className="bg-green-500 hover:bg-green-600">
				Add Habit
			</Button>
		</form>
	);
}
