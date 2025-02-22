dotenv.config();

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

// Generate a JWT token for new users
router.get("/token", (req, res) => {
	const userId = `anon-${Date.now()}`; // Generate unique ID
	const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "30d" }); // 30-day token

	res.json({ token });
});

export default router;
