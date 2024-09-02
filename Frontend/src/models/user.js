import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
