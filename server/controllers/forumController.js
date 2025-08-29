import ForumPost from "../models/ForumPost.js";

export const getForumPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newForumPost = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const post = new ForumPost({ title, content, author, tags });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getForumPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a reply to a post
export const addReply = async (req, res) => {
  try {
    const { author, text } = req.body; // make sure you match the keys sent from frontend
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.replies.push({ text, author: author || "User" });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
