"use client";

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

export default function HabitForm({ habit = null }) {
	const isEditing = !!habit;
	const router = useRouter();
	const { token } = useAuth();

	const [formData, setFormData] = useState({
		name: habit?.name || "",
		logo: habit?.logo || "🏃‍♂️",
		unit: habit?.unit || "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
}
