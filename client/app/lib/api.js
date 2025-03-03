// Example structure for api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;

export const fetchHabits = async (token) => {
	const response = await fetch(`${API_URL}/habits`, {
		headers: {
			Authorisation: `Bearer ${token}`,
		},
	});
	return response.json();
};

export const logHabit = async (token, habitId, value = null) => {
	const response = await fetch(`${API_URL}/habits/${habitId}/complete`, {
		method: "PUT",
		headers: {
			Authorisation: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ value }),
	});
	return response.json();
};

// Add other API functions
