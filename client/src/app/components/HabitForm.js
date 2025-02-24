import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Activity,
	BookOpen,
	Code,
	Coffee,
	Dumbbell,
	Music,
	PencilRuler,
} from "lucide-react"; // ✅ Use existing icons
import { useState } from "react";

// ✅ Updated icon selection list
const iconMap = {
	Activity: Activity, // ✅ Replaced Running with Activity
	BookOpen: BookOpen,
	Music: Music,
	Dumbbell: Dumbbell,
	Code: Code,
	Coffee: Coffee,
	PencilRuler: PencilRuler,
};

export default function HabitForm({ onSubmit }) {
	const [habitName, setHabitName] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("Activity"); // ✅ Default to Activity

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!habitName.trim()) return;

		onSubmit({ name: habitName, logo: selectedIcon }); // ✅ Send selected icon name
		setHabitName("");
		setSelectedIcon("Activity");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
		>
			<h2 className="text-xl font-bold text-white mb-4">Add New Habit</h2>

			{/* ✅ Habit Name Input */}
			<Input
				type="text"
				value={habitName}
				onChange={(e) => setHabitName(e.target.value)}
				placeholder="Enter habit name"
				className="w-full mb-4 text-black"
			/>

			{/* ✅ Icon Selection Dropdown */}
			<label className="text-white mb-2 block">Choose an Icon:</label>
			<div className="flex gap-2 mb-4">
				{Object.entries(iconMap).map(([key, IconComponent]) => (
					<button
						type="button"
						key={key}
						onClick={() => setSelectedIcon(key)}
						className={`p-2 rounded-lg border ${
							selectedIcon === key
								? "bg-blue-500 text-white"
								: "bg-gray-700 text-gray-300"
						}`}
					>
						<IconComponent className="w-6 h-6" />
					</button>
				))}
			</div>

			<Button type="submit" className="w-full">
				Add Habit
			</Button>
		</form>
	);
}
