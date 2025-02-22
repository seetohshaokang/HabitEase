import Link from "next/link";

function Home() {
	return (
		<div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
			<h1 className="text-4xl font-bold text-gray-900">HabitEase</h1>
			<p className="mt-2 text-gray-600 max-w-md">
				Build strong habits with smart tracking, streaks, and insights.
			</p>
			<Link href="/dashboard">
				<button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
					Go to Dashboard
				</button>
			</Link>
		</div>
	);
}

export default Home;
