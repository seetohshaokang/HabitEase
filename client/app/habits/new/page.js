"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HabitForm from "../../components/HabitForm"; // Adjust this path as needed based on your project structure
import { useAuth } from "../../context/AuthContext";

export default function NewHabitPage() {
	const { token, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Redirect if not logged in
		if (!loading && !token) {
			router.push("/login");
		}
	}, [token, loading, router]);

	if (loading) {
		return <div className="flex justify-center p-8">Loading...</div>;
	}

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6 text-center">
				Create New Habit
			</h1>
			<HabitForm />
		</div>
	);
}
