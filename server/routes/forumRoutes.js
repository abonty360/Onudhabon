import express from "express";
const router = express.Router();
import Forum from "../models/Forum.js";

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalPosts = await Forum.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Forum.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name roles");

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({
      message: "An error occurred while fetching forum posts.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Forum.findById(id)
      .populate("author", "name roles")
      .populate("replies.author", "name roles");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the post." });
  }
});

router.post("/:id/replies", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    const post = await Forum.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.replies.push({ text, author });
    await post.save();

    res.status(201).json({ message: "Reply added successfully!", post });
  } catch (error) {
    console.error("Error adding reply:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the reply." });
  }
});

router.patch("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const post = await Forum.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.dislikes.pull(userId);

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error while liking post." });
  }
});

router.patch("/:id/dislike", async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const post = await Forum.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.likes.pull(userId);

    const hasDisliked = post.dislikes.includes(userId);

    if (hasDisliked) {
      post.dislikes.pull(userId);
    } else {
      post.dislikes.push(userId);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error disliking post:", error);
    res.status(500).json({ message: "Server error while disliking post." });
  }
});

router.patch("/:postId/replies/:replyId/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId, replyId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const post = await Forum.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    reply.dislikes.pull(userId);

    const hasLiked = reply.likes.includes(userId);
    if (hasLiked) {
      reply.likes.pull(userId);
    } else {
      reply.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error liking reply:", error);
    res.status(500).json({ message: "Server error while liking reply." });
  }
});

router.patch("/:postId/replies/:replyId/dislike", async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId, replyId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const post = await Forum.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const reply = post.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    reply.likes.pull(userId);

    const hasDisliked = reply.dislikes.includes(userId);
    if (hasDisliked) {
      reply.dislikes.pull(userId);
    } else {
      reply.dislikes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error disliking reply:", error);
    res.status(500).json({ message: "Server error while disliking reply." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content, tags, author } = req.body;

    if (!author) {
      return res.status(400).json({ message: "An author is required." });
    }

    const newForumPost = new Forum({
      title,
      content,
      tags,
      author,
    });

    await newForumPost.save();

    res.status(201).json({
      message: "Forum post created successfully!",
      post: newForumPost,
    });
  } catch (error) {
    console.error("Error creating forum post:", error);
    res.status(500).json({
      message: "An error occurred while creating the forum post.",
    });
  }
});

export default router;
