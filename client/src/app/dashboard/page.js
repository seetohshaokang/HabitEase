import HabitTracker from "../components/HabitTracker";

export default function Dashboard() {
	return (
		<div className="h-screen flex flex-col items-center justify-center bg-blue-100">
			<h1 className="text-4xl font-bold text-blue-900">Dashboard</h1>
			<HabitTracker />
		</div>
	);
}
