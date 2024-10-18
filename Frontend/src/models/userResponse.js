import mongoose, { Schema, models, model } from "mongoose";

const UserResponsesSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },

    analysis_result:
    {
        type: Object,
    }
    ,

    created_at: {
        type: Date,
        default: Date.now
    },
});

export default
    models.QaAssignment ?? model("QaAssignment", UserResponsesSchema);