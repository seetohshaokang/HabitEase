import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // ✅ Delete icon

export default function HabitList({ habits }) {
	if (!habits.length)
		return <p className="text-center text-gray-400">No habits yet.</p>;

	return (
		<div className="flex flex-col gap-4 w-full">
			{habits.map((habit) => (
				<div
					key={habit._id}
					className="bg-blue-500 p-4 rounded-lg shadow-md flex items-center justify-between"
				>
					{/* ✅ Habit Name + Emoji */}
					<div className="flex items-center space-x-3">
						<span className="text-xl">{habit.logo}</span>
						<span className="text-lg font-semibold text-white">
							{habit.name}
						</span>
					</div>

					{/* ✅ Delete Button */}
					<Button variant="destructive">
						<Trash2 className="h-5 w-5" />
					</Button>
				</div>
			))}
		</div>
	);
}
