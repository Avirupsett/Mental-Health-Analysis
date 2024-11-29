import { Schema, models, model } from "mongoose";

const ProgressSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    pending_assignments: {
        type: Number,
        default: process.env.MAX_ASSIGNMENT
    },
    next_assignment_date: {
        type: Date,
    },
    warning_type: {
        type: Number,
        default: 0
    },

    created_at: {
        type: Date,
        default: Date.now
    },
});

export default
    models.Progress ?? model("Progress", ProgressSchema);