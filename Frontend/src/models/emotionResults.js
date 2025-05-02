import mongoose, { Schema, models, model } from "mongoose";

const EmotionResultsSchema = new Schema({
	user_id: {
        type: String,
        required: true
    },
	
    dominant:{
        type: String,
    },
    confidence:{
        type: Number,
    },
    emotions:{
        type: Object,
    },
    duration:{
        type: Number,
    },
    stressLevel:{
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

export default
	models.EmotionResults ?? model("EmotionResults", EmotionResultsSchema);