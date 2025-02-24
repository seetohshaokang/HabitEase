import { Button } from "@/components/ui/button";
import {
	Activity,
	BookOpen,
	Code,
	Coffee,
	Dumbbell,
	Music,
	PencilRuler,
	Trash2,
} from "lucide-react";
// ✅ Replaced "Running" with "Activity" (since Running doesn't exist)

// ✅ Ensure each icon is correctly mapped
const iconMap = {
	Activity: Activity, // ✅ Replaced Running with Activity
	BookOpen: BookOpen,
	Music: Music,
	Dumbbell: Dumbbell,
	Code: Code,
	Coffee: Coffee,
	PencilRuler: PencilRuler,
};

export default function HabitList({ habits, onDelete }) {
	console.log("Habits:", habits);
	if (!habits.length)
		return <p className="text-center text-gray-400">No habits yet.</p>;

	return (
		<div className="flex flex-col gap-4 w-full">
			{habits.map((habit) => {
				const IconComponent = iconMap[habit.logo] || Activity; // ✅ Fallback icon\
				console.log("Rendering icons:", habit.logo, IconComponent);
				return (
					<div
						key={habit._id}
						className="bg-blue-500 p-4 rounded-lg shadow-md flex items-center justify-between"
					>
						{/* ✅ Render Correct Icon */}
						<div className="flex items-center space-x-3">
							<span className="text-2xl">
								<IconComponent />{" "}
								{/* ✅ Dynamically Render Icon */}
							</span>
							<span className="text-lg font-semibold text-white">
								{habit.name}
							</span>
						</div>

						{/* ✅ Delete Button */}
						<Button
							variant="destructive"
							onClick={() => onDelete(habit._id)}
						>
							<Trash2 className="h-5 w-5" />
						</Button>
					</div>
				);
			})}
		</div>
	);
}
