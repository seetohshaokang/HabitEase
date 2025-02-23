import { Geist, Geist_Mono } from "next/font/google";
import AuthWrapper from "./components/authWrapper";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "HabitEase - Track Your Habits",
	description: "An easy way to build and track habits.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen bg-gray-900`}
			>
				{/* Wrap everything inside AuthWrapper */}
				<AuthWrapper>{children}</AuthWrapper>
			</body>
		</html>
	);
}
