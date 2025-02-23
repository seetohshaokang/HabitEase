import HabitTracker from "../components/HabitTracker";

export default function Dashboard() {
	return (
		<div className="min-h-screen w-full flex flex-col items-center bg-blue-100 py-10">
			<h1 className="text-4xl font-bold text-gray-100 mb-6">Dashboard</h1>
			<HabitTracker />
		</div>
	);
}
