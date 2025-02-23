import HabitTracker from "../components/HabitTracker";

export default function Dashboard() {
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900">
			<h1 className="text-4xl font-bold text-gray-100 mt-6">Dashboard</h1>
			<div className="w-full flex justify-center"></div>
			<HabitTracker />
		</div>
	);
}
