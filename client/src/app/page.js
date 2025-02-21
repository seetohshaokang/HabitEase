import Link from "next/link";

export default function Home() {
	return (
		<div className="h-screen flex flex-col items-center justify-center bg-gray-100">
			<h1 className="text-4xl font-bold text-gray-900">Habit Tracker</h1>
			<p className="mt-2 text-gray-600">Build and track habits easily.</p>
			<Link href="/dashboard">
				<button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
					Go to Dashboard
				</button>
			</Link>
		</div>
	);
}
