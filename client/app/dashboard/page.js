"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HabitCard from "../components/HabitCard";
import Button from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { fetchHabits } from "../lib/api";

export default function Dashboard() {
	const { token, loading, logout } = useAuth();
	const [habits, setHabits] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (!loading && token) {
			loadHabits();
		} else if (!loading && !token) {
			router.push("/login");
		}
	}, [token, loading]);

	const loadHabits = async () => {
		try {
			setIsLoading(true);
			const data = await fetchHabits(token);

			// Add defensive check - make sure we're setting an array
			if (Array.isArray(data)) {
				setHabits(data);
			} else {
				console.error("API did not return an array:", data);
				setHabits([]); // Set to empty array as fallaback
			}
		} catch (error) {
			console.error("Error loading habits:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	if (loading || isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">My Habits</h1>
				<div className="flex gap-2">
					<Button onClick={() => router.push("/habits/new")}>
						Add Habit
					</Button>
					<Button
						variant="outline"
						onClick={handleLogout}
						className="ml-2"
					>
						Logout
					</Button>
				</div>
			</div>

			{habits.length === 0 ? (
				<div className="text-center py-10">
					<p>You don't have any habits yet,</p>
					<Button
						className="mt-4"
						onClick={() => router.push("/habits/new")}
					>
						Create your first habit
					</Button>
				</div>
			) : (
				<div className="grid grid-col-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{habits.map((habit) => (
						<HabitCard
							key={habit._id}
							habit={habit}
							onComplete={loadHabits}
						/>
					))}
				</div>
			)}
		</div>
	);
}
