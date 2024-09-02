import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoDB";
import User from "@/models/User";

export const authMiddleware = async (req, res, next) => {
	await dbConnect();

	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: "Token is not valid" });
	}
};
