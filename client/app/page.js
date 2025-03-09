"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

export default function Home() {
	const { token, login, loading } = useAuth();
	const router = useRouter();
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// If user is already logged in, redirect to dashboard
		if (!loading && token) {
			router.push("/dashboard");
		}
	}, [token, loading, router]);

	const handleGetStarted = async () => {
		try {
			setIsLoggingIn(true);
			setError(null);

			// Attempt to login anonymously
			const success = await login();
			if (success) {
				router.push("/dashboard");
			} else {
				setError("Failed to create a session. Please try again.");
			}
		} catch (error) {
			console.error("Error during login:", error);
			setError("Something went wrong. Please try again.");
		} finally {
			setIsLoggingIn(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			{/* Hero Section */}
			<div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
				<h1 className="text-4xl md:text-5xl font-bold mb-6">
					Welcome to <span className="text-blue-500">HabitEase</span>
				</h1>

				<p className="text-xl text-gray-600 max-w-2xl mb-8">
					Build better habits, track your progress, and achieve your
					goals with our simple habit tracking app.
				</p>

				{error && (
					<div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 max-w-md">
						{error}
					</div>
				)}

				<button
					onClick={handleGetStarted}
					disabled={isLoggingIn}
					className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md text-lg transition-colors disabled:bg-blue-300"
				>
					{isLoggingIn ? "Creating your profile..." : "Get Started"}
				</button>

				<div className="bg-blue-50 p-4 rounded-md mt-4 max-w-md">
					<p className="text-sm text-blue-700">
						No account needed! We'll create an anonymous profile for
						you to start tracking habits right away.
					</p>
				</div>
			</div>

			{/* Features Section */}
			<div className="bg-gray-50 pt-16 pb-16 px-4">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl font-bold text-center mb-12">
						Key Features
					</h2>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="text-3xl mb-4">📊</div>
							<h3 className="text-xl font-semibold mb-2">
								Track Daily
							</h3>
							<p className="text-gray-600">
								Log your habits every day and build consistent
								routines.
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="text-3xl mb-4">📈</div>
							<h3 className="text-xl font-semibold mb-2">
								See Progress
							</h3>
							<p className="text-gray-600">
								View your history and track your improvement
								over time.
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="text-3xl mb-4">🔥</div>
							<h3 className="text-xl font-semibold mb-2">
								Build Streaks
							</h3>
							<p className="text-gray-600">
								Stay motivated with continuous streaks and
								achievements.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="pt-6 pb-6 text-center text-gray-500 text-sm">
				<p>
					&copy; {new Date().getFullYear()} HabitEase. All rights
					reserved.
				</p>
			</footer>
		</div>
	);
}
