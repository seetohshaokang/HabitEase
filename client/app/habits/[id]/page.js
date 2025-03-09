"use client";

import HabitVisualizations from "@/app/components/HabitVisualizations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
	deleteHabit,
	deleteHabitLog,
	getHabit,
	getHabitLogs,
	getHabitStatistics,
	logHabit,
	updateHabitLog,
} from "../../lib/api";

import EditLogModal from "../../components/EditLogModal";

export default function HabitDetail({ params }) {
	const id = params.id; // Explicitly match structure that Next.js provides
	const { token, loading } = useAuth();
	const router = useRouter();

	const [habit, setHabit] = useState(null);
	const [logs, setLogs] = useState([]);
	const [stats, setStats] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [editingLog, setEditingLog] = useState(null);

	useEffect(() => {
		if (!loading && token) {
			loadHabitData();
		} else if (!loading && !token) {
			router.push("/");
		}
	}, [id, token, loading]);

	const loadHabitData = async () => {
		try {
			setIsLoading(true);
			console.log("Loading habit data for ID:", id);
			console.log(
				"Using token:",
				token ? "Valid token exists" : "No token"
			);

			// Fetch habit data first to debug more easily
			try {
				const habitData = await getHabit(token, id);
				console.log("Successfully fetched habit data:", habitData);
				setHabit(habitData);

				// Now fetch the remaining data
				const [logsData, statsData] = await Promise.all([
					getHabitLogs(token, id),
					getHabitStatistics(token, id),
				]);

				setLogs(logsData);
				setStats(statsData);
			} catch (error) {
				console.error("Specific error fetching habit:", error.message);
				throw error; // Re-throw to be caught by outer catch
			}
		} catch (error) {
			console.error("Error loading habit data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogHabit = async () => {
		try {
			await logHabit(token, id);
			loadHabitData(); // Refresh data
		} catch (error) {
			console.error("Error logging habit:", error);
		}
	};

	const handleUpdateLog = async (logId, data) => {
		try {
			await updateHabitLog(token, logId, data);
			loadHabitData(); // Refresh data
		} catch (error) {
			console.error("Error updating log:", error);
		}
	};

	const handleDeleteLog = async (logId) => {
		try {
			await deleteHabitLog(token, logId);
			loadHabitData(); // Refresh data
		} catch (error) {
			console.error("Error deleting log:", error);
		}
	};

	const handleDeleteHabit = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this habit and all its logs?"
			)
		) {
			return;
		}

		try {
			setIsDeleting(true);
			await deleteHabit(token, id);
			router.push("/dashboard");
		} catch (error) {
			console.error("Error deleting habit:", error);
			setIsDeleting(false);
		}
	};
	const confirmDeleteLog = (logId) => {
		if (confirm("Are you sure you want to delete this log entry?")) {
			handleDeleteLog(logId);
		}
	};

	if (isLoading || loading) {
		return <div className="flex justify-center p-8">Loading...</div>;
	}

	if (!habit) {
		return <div className="text-center p-8">Habit not found</div>;
	}

	return (
		<div className="max-w-3xl mx-auto p-4">
			<div className="mb-6">
				<button
					onClick={() => router.back()}
					className="text-blue-500 hover:underline flex items-center"
				>
					← Back
				</button>
			</div>
			<div className="flex justify-between items-start mb-6">
				<div>
					<h1 className="text-3xl font-bold flex items-center">
						<span className="mr-3 text-4xl">{habit.logo}</span>
						{habit.name}
					</h1>

					{habit.streak > 0 && (
						<div className="mt-2 text-orange-500 flex items-center">
							<span className="mr-1">🔥</span>
							Current streak: {habit.streak} days
						</div>
					)}
				</div>

				<div className="flex gap-2">
					<button
						onClick={() => router.push(`/habits/${id}/edit`)}
						className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
					>
						Edit
					</button>

					<button
						onClick={handleDeleteHabit}
						disabled={isDeleting}
						className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>
			{/* Statistics Section */}
			{stats && (
				<div className="bg-white rounded-lg shadow p-4 mb-6">
					<h2 className="text-xl font-semibold mb-3">Statistics</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-3 bg-blue-50 rounded-md">
							<p className="text-sm text-gray-500">
								Completion Rate
							</p>
							<p className="text-2xl font-bold">
								{stats.completionRate}%
							</p>
						</div>

						<div className="p-3 bg-green-50 rounded-md">
							<p className="text-sm text-gray-500">
								Current Month
							</p>
							<p className="text-2xl font-bold">
								{stats.currentMonthCompletions} days
							</p>
						</div>

						<div className="p-3 bg-purple-50 rounded-md">
							<p className="text-sm text-gray-500">
								Total Completions
							</p>
							<p className="text-2xl font-bold">
								{stats.totalLogs}
							</p>
						</div>
					</div>

					{stats.mostConsistentDay && (
						<p className="mt-4 text-gray-700">
							<span className="font-medium">
								Most consistent day:
							</span>{" "}
							{stats.mostConsistentDay}
						</p>
					)}
				</div>
			)}
			{/* Today&apos;s Status and Action */}
			<div className="bg-white rounded-lg shadow p-4 mb-6">
				<h2 className="text-xl font-semibold mb-3">Today</h2>

				{isTodayCompleted(logs) ? (
					<div className="bg-green-50 p-4 rounded-md flex items-center">
						<span className="text-green-500 text-xl mr-2">✓</span>
						<div>
							<p className="font-medium">Completed today</p>
							<p className="text-sm text-gray-500">
								{formatTime(getTodayLog(logs)?.timeStamp)}
							</p>
						</div>
					</div>
				) : (
					<div className="flex items-center">
						<p className="text-gray-700 flex-1">
							You haven&apos;t completed this habit today.
						</p>
						<button
							onClick={handleLogHabit}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Complete Now
						</button>
					</div>
				)}
			</div>

			<div className="bg-white rounded-lg shadow p-4 mb-8">
				<h2 className="text-xl font-semibold mb-3">Recent Activity</h2>

				{logs.length === 0 ? (
					<p className="text-gray-500">No activity logged yet</p>
				) : (
					<div className="border rounded-md overflow-hidden">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
										Date
									</th>
									<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
										Status
									</th>
									{habit.unit && (
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
											Value
										</th>
									)}
									<th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{logs
									.sort(
										(a, b) =>
											new Date(b.timeStamp) -
											new Date(a.timeStamp)
									)
									.slice(0, 10) // Show last 10 entries
									.map((log) => (
										<tr key={log._id}>
											<td className="px-4 py-3 text-gray-700">
												{formatDate(log.timeStamp)}
											</td>
											<td className="px-4 py-3">
												<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
													Completed
												</span>
											</td>
											{habit.unit && (
												<td className="px-4 py-3 text-gray-700">
													{log.value || "-"}
												</td>
											)}
											<td className="px-4 py-3 text-right">
												<div className="flex justify-end space-x-2">
													<button
														onClick={() =>
															setEditingLog(log)
														}
														className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-3 w-3 mr-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
															/>
														</svg>
														Edit
													</button>
													<button
														onClick={() =>
															confirmDeleteLog(
																log._id
															)
														}
														className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors flex items-center"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-3 w-3 mr-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				)}

				{/* Edit Log Modal */}
				{editingLog && (
					<EditLogModal
						log={editingLog}
						habit={habit}
						onUpdate={handleUpdateLog}
						onDelete={handleDeleteLog}
						onClose={() => setEditingLog(null)}
					/>
				)}
			</div>
			{/* Habit Visualizations */}
			<div className="mt-8">
				<HabitVisualizations habit={habit} logs={logs} />
			</div>
		</div>
	);
}

// Helper functions
function isTodayCompleted(logs) {
	return !!getTodayLog(logs);
}

function getTodayLog(logs) {
	if (!logs || logs.length === 0) return null;

	const today = new Date().toISOString().split("T")[0];
	return logs.find((log) => {
		const logDate = new Date(log.timeStamp).toISOString().split("T")[0];
		return logDate === today;
	});
}

function formatDate(dateString) {
	const options = { weekday: "short", month: "short", day: "numeric" };
	return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(dateString) {
	if (!dateString) return "";
	const options = { hour: "numeric", minute: "numeric" };
	return new Date(dateString).toLocaleTimeString(undefined, options);
}
