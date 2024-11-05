import mongoose, { Schema, models, model } from "mongoose";

const UserInfoSchema = new Schema({
	user_id: {
        type:  String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
	fullname:{
        type: String,
        required: true
    },
	dateofbirth:{
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    facebook:{
        type: String,
    },
    instagram:{
        type: String,
    },
    twitter:{
        type: String,
    },
    linkedin:{
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});

export default
	models.UserInfo ?? model("UserInfo", UserInfoSchema);