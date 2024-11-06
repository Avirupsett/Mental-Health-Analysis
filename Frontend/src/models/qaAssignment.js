import { Schema, models, model } from "mongoose";

const QaAssignmentSchema = new Schema({
	user_id: {
        type: String,
        required: true
    },
    question: [{
        type: Object,
        required: true
    }],
    answer: [{
        type: Object,
        required: true
    }],
    summary: {
        type: Object
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

export default
	models.QaAssignment ?? model("QaAssignment", QaAssignmentSchema);