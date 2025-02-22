// Ensure LocalStorage is only accessed in the browser (Next.js compatibility)
const isClient = typeof window !== "undefined";

// Get all habits from LocalStorage
export function getHabits() {
	if (!isClient) return []; // Prevent SSR errors
	const habits = localStorage.getItem("habits");
	return habits ? JSON.parse(habits) : [];
}

// Save habits to LocalStorage
export function saveHabits(habits) {
	if (!isClient) return;
	localStorage.setItem("habits", JSON.stringify(habits));
}

// Add a new habit
export function addHabit(newHabit) {
	const habits = getHabits();
	habits.push(newHabit);
	saveHabits(habits);
}

// Update a habit
export function updateHabit(updatedHabit) {
	const habits = getHabits().map((habit) =>
		habit.id === updatedHabit.id ? updatedHabit : habit
	);
	saveHabits(habits);
}

// Delete a habit
export function deleteHabit(habitId) {
	const habits = getHabits().filter((habit) => habit.id !== habitId);
	saveHabits(habits);
}

// Mark a habit as completed (track completion dates)
export function completeHabit(habitId) {
	const habits = getHabit().map((habit) => {
		if (habit.id === habitId) {
			return {
				...habit,
				completedDates: [
					...habit.completedDates,
					new Date().toISOString(),
				],
			};
		}
		return habit;
	});
	saveHabits(habits);
}
