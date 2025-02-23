import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
export const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: "Unauthorized: No token provided" });
	}

	const token = authHeader.split(" ")[1]; // Extract token
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded; // ❌ Might not contain `id`
		next();
	} catch (error) {
		console.error("JWT Verification Error:", error);
		res.status(403).json({ error: "Invalid or expired token" });
	}
};
