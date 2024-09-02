import dbConnect from "@/lib/mongoDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
	await dbConnect();

	if (req.method === "POST") {
		const { email, password } = req.body;

		try {
			// Check if the user already exists
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({ message: "User already exists" });
			}

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create verification token
			const verificationToken = crypto.randomBytes(32).toString("hex");

			// Create user
			const user = await User.create({
				email,
				password: hashedPassword,
				verificationToken,
			});

			// Send verification email
			const transporter = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			const mailOptions = {
				from: process.env.EMAIL_USER,
				to: user.email,
				subject: "Email Verification",
				text: `Verify your email by clicking this link: ${process.env.NEXT_PUBLIC_URL}/verify?token=${verificationToken}`,
			};

			await transporter.sendMail(mailOptions);

			res
				.status(200)
				.json({ message: "Signup successful, please verify your email" });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
