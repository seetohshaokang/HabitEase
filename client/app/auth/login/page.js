"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export default function Login() {
	const { token, login, loading } = useAuth();
	const router = useRouter();
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Redirect if already logged in
		if (!loading && token) {
			router.push("/dashboard");
		}
	}, [token, loading, router]);

	const handleLogin = async () => {
		setIsLoggingIn(true);
		setError(null);

		try {
			const success = await login();
			if (success) {
				router.push("/dashboard");
			} else {
				setError("Failed to create a session. Please try again.");
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
			console.error("Login error:", err);
		} finally {
			setIsLoggingIn(false);
		}
	};

	if (loading) {
		return <div className="flex justify-center p-8">Loading...</div>;
	}

	return (
		<div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-lg shadow-md">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mb-2">
					Welcome to HabitEase
				</h1>
				<p className="text-gray-600">
					Track your habits and build a better routine
				</p>
			</div>

			{error && (
				<div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
					{error}
				</div>
			)}

			<div className="bg-blue-50 p-4 rounded-md mb-6">
				<p className="text-sm text-blue-700">
					No account needed! We'll create an anonymous profile for you
					to start tracking habits right away.
				</p>
			</div>

			<button
				onClick={handleLogin}
				disabled={isLoggingIn}
				className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 font-medium disabled:bg-blue-300"
			>
				{isLoggingIn ? "Creating your profile..." : "Get Started"}
			</button>

			<p className="text-xs text-gray-500 mt-4 text-center">
				By continuing, you agree to our Terms of Service and Privacy
				Policy. All data is stored locally on your device.
			</p>
		</div>
	);
}
