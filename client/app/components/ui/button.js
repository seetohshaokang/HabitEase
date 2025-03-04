export default function Button({
	children,
	variant = "primary",
	size = "md",
	className = "",
	...props
}) {
	const baseStyles =
		"font-medium rounded focus:outline-none transition-colors";

	const variantStyles = {
		primary: "bg-blue-500 hover:bg-blue-600 text-white",
		secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
		success: "bg-green-500 hover:bg-red-600 text-white",
		danger: "bg-red-500 hover:bg-red-600 text-white",
		outline:
			"bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700",
	};

	const sizeStyles = {
		sm: "text-xs px-2 py-2",
		md: "text-sm px-4 py-2",
		lg: "text-base px-6 py-3",
	};

	const disabledStyles = props.disabled
		? "opacity-50 cursor-not-allowed"
		: "";

	const buttonClasses = `
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
    `;

	return (
		<button className={buttonClasses} {...props}>
			{children}
		</button>
	);
}
