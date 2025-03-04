import { Inter } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "HabitEase - Track Your Habits",
	description: "A simple habit tracking app to build better habits",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-gray-50 min-h-screen`}>
				<AuthProvider>
					<main className="container mx-auto px-4 py-8">
						{children}
					</main>
				</AuthProvider>
			</body>
		</html>
	);
}
