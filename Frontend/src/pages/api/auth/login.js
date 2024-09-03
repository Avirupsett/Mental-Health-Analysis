import dbConnect from "@/lib/mongoDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
	await dbConnect();

	if (req.method === "POST") {
		const { email, password } = req.body;

		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: "User not found" });
			}

			if (!user.isVerified) {
				return res
					.status(400)
					.json({ message: "Please verify your email first" });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			res.status(200).json({ token });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
