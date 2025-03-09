"use client";

import { useState } from "react";

export default function EditLogModal({
	log,
	habit,
	onUpdate,
	onDelete,
	onClose,
}) {
	const [value, setValue] = useState(log.value || "");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [date, setDate] = useState(
		new Date(log.timeStamp).toISOString().split("T")[0]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		try {
			setIsSubmitting(true);
			await onUpdate(log._id, {
				value: value.trim() !== "" ? value : null,
				timestamp: new Date(date).toISOString(),
			});
			onClose();
		} catch (error) {
			console.error("Error updating log:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (isSubmitting) return;

		if (!confirm("Are you sure you want to delete this log entry?")) {
			return;
		}

		try {
			setIsSubmitting(true);
			await onDelete(log._id);
			onClose();
		} catch (error) {
			console.error("Error deleting log:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full">
				<h2 className="text-xl font-semibold mb-4 flex items-center">
					<span className="text-2xl mr-2">{habit.logo}</span>
					Edit Log Entry
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-gray-700 mb-2"
							htmlFor="logDate"
						>
							Date
						</label>
						<input
							id="logDate"
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded"
						/>
					</div>

					{habit.unit && (
						<div className="mb-4">
							<label
								className="block text-gray-700 mb-2"
								htmlFor="logValue"
							>
								{habit.unit}
							</label>
							<input
								id="logValue"
								type="text"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder={`Enter ${habit.unit}`}
								className="w-full p-2 border border-gray-300 rounded"
							/>
						</div>
					)}

					<div className="flex justify-between space-x-2 mt-6">
						<button
							type="button"
							onClick={handleDelete}
							className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
						>
							Delete
						</button>

						<div className="flex space-x-2">
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
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
							>
								{isSubmitting ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
