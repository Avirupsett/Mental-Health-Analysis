import dbConnect from "@/lib/mongoDB";
import User from "@/models/User";

export default async function handler(req, res) {
	await dbConnect();

	if (req.method === "GET") {
		const { token } = req.query;

		try {
			const user = await User.findOne({ verificationToken: token });

			if (!user) {
				return res.status(400).json({ message: "Invalid or expired token" });
			}

			user.isVerified = true;
			user.verificationToken = undefined;
			await user.save();

			res.status(200).json({ message: "Email verified successfully" });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
