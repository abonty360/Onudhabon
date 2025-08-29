import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: { type: String, default: "Anonymous" },
    tags: [String],
    replies: [
      {
        text: String,
        author: { type: String, default: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const ForumPost = mongoose.model("ForumPost", forumPostSchema);


export default ForumPost;
