// Example structure for api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;

// Auth API calls
export const getToken = async () => {
	const response = await fetch(`${API_URL}/auth/token`);
	return response.json();
};

// Habit APi calls
export const fetchHabits = async (token) => {
	const response = await fetch(`${API_URL}/habits`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.json();
};

export const getHabit = async (token, habitId) => {
	const response = await fetch(`${API_URL}/habits/${habitId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetech habit");
	}
	return response.json();
};

export const createHabit = async (token, habitData) => {
	const response = await fetch(`${API_URL}/habits`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(habitData),
	});

	if (!response.ok) {
		throw new Error("Failed to create habit");
	}

	return response.json();
};

export const updateHabit = async (token, habitId, habitData) => {
	const response = await fetch(`${API_URL}/habits/${habitId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(habitData),
	});

	if (!response.ok) {
		throw new Error("Failed to update habit");
	}

	return response.json();
};

export const deleteHabit = async (token, habitId) => {
	const response = await fetch(`${API_URL}/habits/${habitId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to delete habit");
	}

	return response.json();
};

export const logHabit = async (token, habitId, value = null) => {
	const response = await fetch(`${API_URL}/habits/${habitId}/complete`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ value }),
	});
	return response.json();
};

export const getHabitLogs = async (token, habitId) => {
	const response = await fetch(`${API_URL}/habits/${habitId}/logs`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch habit logs");
	}
	return response.json();
};

export const getHabitStatistics = async (token, habitId) => {
	const response = await fetch(`${API_URL}/habits/${habitId}/statistics`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch habit statistics");
	}

	return response.json();
};

export const getAllHabitsStatistics = async (token) => {
	const response = await fetch(`${API_URL}/habits/statistics/summary`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch habits statistics");
	}
	return response.json();
};
