// components/LogHabitModal.js
"use client";

import { useState } from "react";

export default function LogHabitModal({ habit, onComplete, onClose }) {
	const [value, setValue] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		try {
			setIsSubmitting(true);
			await onComplete(habit._id, value.trim() !== "" ? value : null);
			onClose();
		} catch (error) {
			console.error("Error logging habit:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full">
				<h2 className="text-xl font-semibold mb-4 flex items-center">
					<span className="text-2xl mr-2">{habit.logo}</span>
					Log {habit.name}
				</h2>

				<form onSubmit={handleSubmit}>
					{habit.unit && (
						<div className="mb-4">
							<label
								className="block text-gray-700 mb-2"
								htmlFor="habitValue"
							>
								Measurement: {habit.unit}
							</label>
							<input
								id="habitValue"
								type="text"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder={`Enter ${habit.unit}`}
								className="w-full p-2 border border-gray-300 rounded"
								autoFocus
							/>
						</div>
					)}

					<div className="flex justify-end space-x-2 mt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
						>
							{isSubmitting ? "Logging..." : "Complete Habit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
