"use client";

export default function Habitcard({ habit, onComplete }) {
	const { token } = useAuth();
	const router = useRouter();
	const [isLoggin, setIsLogging] = useState(false);

	// Check if habit was completed today
	const iscompletedToday = () => {
		if (!habit.logs || habit.logs.length === 0) return false;

		const today = new Date().toISOString().split("T")[0];
		return habit.logs.some((log) => {
			const logDate = new Date(log.timeStamp).toISOString().split("T")[0];
			return logDate === today;
		});
	};

	const completed = isCompletedToday();

	const handleLogHabit = async () => {
		if (isLoggin) return;

		try {
			setIsLogging(true);
			await logHabit(token, habit._id);
			onComplete(); // Refresh habits after logging
		} catch (error) {
			console.error("Error loggin habit:", error);
		} finally {
			setIsLogging(false);
		}
	};

	const handleCardClick = () => {
		router.push(`/habits/${habit._id}`);
	};

	return (
		<div
			className={`rounded-lg p-4 shadow-md transition-all cursor-pointer
                ${
					completed
						? "bg-green-50 border-green-200"
						: "bg-white border-gray-200"
				} 
                border hover:shadow-lg`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1" onClick={handleCardClick}>
					<div className="text-3xl mb-2">{habit.log}</div>
					<h3 className="font-semibold text-lg">{habit.name}</h3>

					{habit.streak > 0 && (
						<div className="flex items-center mt-1 text-sm text-orange-500">
							<span className="mr-1">🔥</span>
							<span>{habit.streak} day streak</span>
						</div>
					)}
				</div>

				<button
					onClick={(e) => {
						e.stopPropagation();
						handleLogHabit();
					}}
					disabled={isLogging || completed}
					className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors
                        ${
							completed
								? "bg-green-500 text-white cursor-default"
								: "bg-gray-100 hover:bg-green-100 text-gray-500 hover:text-green-500"
						}`}
				>
					{completed ? "✓" : "+"}
				</button>
			</div>

			<div className="mt-3 text-sm text-gray-500">
				{completed ? `Completed today` : "Not completed today"}
			</div>
		</div>
	);
}
