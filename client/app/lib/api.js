// Example structure for api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;

// Auth API calls
export const getToken = async () => {
	const response = await fetch(`${API_URL}/auth/token`);
	return response.json();
};

// Habit API calls
export const fetchHabits = async (token) => {
	// First fetch all habits
	const response = await fetch(`${API_URL}/habits`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const habits = await response.json();

	// If we have habits, fetch logs for each one
	if (Array.isArray(habits) && habits.length > 0) {
		// Fetch logs for each habit
		const habitsWithLogs = await Promise.all(
			habits.map(async (habit) => {
				try {
					const logs = await getHabitLogs(token, habit._id);
					return { ...habit, logs };
				} catch (error) {
					console.error(
						`Error fetching logs for habit ${habit._id}:`,
						error
					);
					return { ...habit, logs: [] };
				}
			})
		);

		return habitsWithLogs;
	}

	return habits;
};

export const getHabit = async (token, habitId) => {
	if (!habitId) {
		throw new Error("Habit ID is required");
	}

	try {
		console.log(`Fetching habit with ID: ${habitId}`);
		const response = await fetch(`${API_URL}/habits/${habitId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			// Get more detailed error information
			const errorText = await response.text();
			console.error(`API returned ${response.status}: ${errorText}`);
			throw new Error(
				`Failed to fetch habit: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error in getHabit:", error);
		throw error;
	}
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

// Add or update this function in lib/api.js
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
		const errorText = await response.text();
		console.error(`API error: ${errorText}`);
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

export const generateSampleData = async (token) => {
	const response = await fetch(`${API_URL}/habits/sample-data`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to generate sample data");
	}

	return response.json();
};

export const updateHabitLog = async (token, logId, data) => {
	const response = await fetch(`${API_URL}/habits/log/${logId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to update habit log");
	}

	return response.json();
};

export const deleteHabitLog = async (token, logId) => {
	const response = await fetch(`${API_URL}/habits/log/${logId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to delete habit log");
	}

	return response.json();
};
