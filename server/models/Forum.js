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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // --- NEW FIELDS FOR THE MAIN POST ---
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // ------------------------------------
    replies: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            text: {
                type: String,
                required: true
            },
            // --- NEW FIELDS FOR EACH REPLY ---
            likes: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            dislikes: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            // ---------------------------------
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