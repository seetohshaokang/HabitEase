// app/habits/[id]/edit/page.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import EditHabitForm from "../../../components/EditHabitForm";
import { useAuth } from "../../../context/AuthContext";

export default function EditHabitPage({ params }) {
	const { id } = params;
	const { token, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Redirect if not logged in
		if (!loading && !token) {
			router.push("/");
		}
	}, [token, loading, router]);

	if (loading) {
		return <div className="flex justify-center p-8">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="mb-6">
				<button
					onClick={() => router.back()}
					className="text-blue-500 hover:underline flex items-center"
				>
					← Back
				</button>
			</div>

			<EditHabitForm habitId={id} />
		</div>
	);
}
