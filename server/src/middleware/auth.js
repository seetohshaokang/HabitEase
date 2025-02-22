dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to verify JWT
export function verifyToken(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(403).json({ error: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.userId = decoded.userId; // Attach userId to request
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
}
