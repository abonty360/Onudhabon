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
    author: { // Add an author field
        type: String,
        default: "Anonymous"
    },
    replies: [ // Add a replies array
        {
            author: {
                type: String,
                default: "User"
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Forum = mongoose.model("Forum", forumSchema);

export default Forum;