import { authMiddleware } from "@/middleware/auth";

export default async function handler(req, res) {
	authMiddleware(req, res, async () => {
		// Your protected logic here
		res.status(200).json({ message: "Protected route accessed!" });
	});
}
