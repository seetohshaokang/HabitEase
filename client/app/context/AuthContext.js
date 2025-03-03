// Example structure for AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check localStorage for existing token
		const storedToken = localStorage.getItem("habitease-token");
		if (storedToken) {
			setToken(storedToken);
		}
		setLoading(false);
	}, []);

	const login = async () => {
		try {
			const response = await fetch(
				"http://localhost:8000/api/auth/token"
			);
			const data = await response.json();
			localStorage.setItem("habitease-token", data.token);
			setToken(data.token);
			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	const logout = () => {
		localStorage.removeItem("habitease-token");
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ token, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
