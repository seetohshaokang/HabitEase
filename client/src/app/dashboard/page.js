import HabitTracker from "../components/HabitTracker";

export default function Dashboard() {
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-zinc-100">
			<h1 className="text-4xl font-bold text-gray-900 mt-6 pb-10">
				Dashboard
			</h1>
			<div className="w-full flex justify-center">
				<HabitTracker />
			</div>
		</div>
	);
}
