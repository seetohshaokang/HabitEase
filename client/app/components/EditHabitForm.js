// components/EditHabitForm.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getHabit, updateHabit } from "../lib/api";

// Available emoji options for habit icons
const emojiOptions = [
	"🏃‍♂️",
	"💧",
	"📚",
	"💪",
	"🧘‍♀️",
	"🥗",
	"💤",
	"🎸",
	"💊",
	"🚰",
	"✍️",
	"🧠",
	"🎯",
	"🚭",
	"💻",
	"🧹",
];

export default function EditHabitForm({ habitId }) {
	const router = useRouter();
	const { token } = useAuth();

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		name: "",
		logo: "🏃‍♂️",
		unit: "",
	});

	useEffect(() => {
		// Fetch habit details when component mounts
		const fetchHabitDetails = async () => {
			try {
				setIsLoading(true);
				const habit = await getHabit(token, habitId);

				setFormData({
					name: habit.name || "",
					logo: habit.logo || "🏃‍♂️",
					unit: habit.unit || "",
				});
			} catch (error) {
				console.error("Error fetching habit details:", error);
				setError("Failed to load habit details");
			} finally {
				setIsLoading(false);
			}
		};

		if (token && habitId) {
			fetchHabitDetails();
		}
	}, [habitId, token]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleEmojiSelect = (emoji) => {
		setFormData((prev) => ({ ...prev, logo: emoji }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			setError("Habit name is required");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			await updateHabit(token, habitId, formData);
			router.push(`/habits/${habitId}`);
		} catch (error) {
			console.error("Error updating habit:", error);
			setError("Failed to update habit. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="text-center py-10">Loading habit details...</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Edit Habit</h1>

			{error && (
				<div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
					{error}
				</div>
			)}

			<div className="mb-4">
				<label className="block text-gray-700 mb-2" htmlFor="name">
					Habit Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="e.g., Morning Run"
					className="w-full p-2 border border-gray-300 rounded"
					required
				/>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700 mb-2">Choose Icon</label>
				<div className="grid grid-cols-4 gap-2">
					{emojiOptions.map((emoji) => (
						<button
							key={emoji}
							type="button"
							onClick={() => handleEmojiSelect(emoji)}
							className={`text-2xl p-2 rounded-md transition-colors
                ${
					formData.logo === emoji
						? "bg-blue-100 border-blue-300"
						: "bg-gray-50 border-gray-200"
				} 
                border hover:bg-blue-50`}
						>
							{emoji}
						</button>
					))}
				</div>
			</div>

			<div className="mb-6">
				<label className="block text-gray-700 mb-2" htmlFor="unit">
					Unit (Optional)
				</label>
				<input
					type="text"
					id="unit"
					name="unit"
					value={formData.unit}
					onChange={handleChange}
					placeholder="e.g., minutes, pages, glasses"
					className="w-full p-2 border border-gray-300 rounded"
				/>
				<p className="text-sm text-gray-500 mt-1">
					For measurable habits like &quot;20 minutes&quot; or &quot;8
					glasses&quot;
				</p>
			</div>

			<div className="flex gap-3">
				<button
					type="button"
					onClick={() => router.back()}
					className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex-1"
				>
					{isSubmitting ? "Saving..." : "Update Habit"}
				</button>
			</div>
		</form>
	);
}
