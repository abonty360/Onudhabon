import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Forum = mongoose.model("Forum", forumSchema);

export default Forum;