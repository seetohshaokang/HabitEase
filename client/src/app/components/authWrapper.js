"use client"; // ✅ Ensures this runs on the client side

import { useEffect, useState } from "react";

export default function AuthWrapper({ children }) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchToken() {
			let token = localStorage.getItem("userToken");

			if (!token) {
				try {
					const response = await fetch(
						"http://localhost:8000/api/auth/token"
					); // ✅ Fetch JWT token from backend

					if (!response.ok) {
						throw new Error(
							`Server returned ${response.status}: ${response.statusText}`
						);
					}

					const data = await response.json();
					token = data.token;

					if (token) {
						localStorage.setItem("userToken", token); // ✅ Store token locally
					}
				} catch (error) {
					console.error("Failed to fetch user token:", error);
				}
			}
			console.log(token);
			setLoading(false); // ✅ Finish loading once token is set
		}

		fetchToken();
	}, []);

	// ✅ Show loading message until token is set
	if (loading) {
		return <div className="text-center text-gray-500">Loading...</div>;
	}

	return <>{children}</>;
}
