import express from "express";
const router = express.Router();
import Forum from "../models/Forum.js"; // Make sure this path is correct


// Route to get all forum posts
router.get("/", async (req, res) => {
    try {
        const posts = await Forum.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching forum posts:", error);
        res.status(500).json({
            message: "An error occurred while fetching forum posts.",
        });
    }
});

// Route to get a single forum post by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Forum.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "An error occurred while fetching the post." });
    }
});


// Route to add a new reply to a post
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
        res.status(500).json({ message: "An error occurred while adding the reply." });
    }
});


// Route to handle new forum post submissions
router.post("/", async (req, res) => {
    try {
        // Destructure the data from the request body
        const { title, content, tags } = req.body;

        // Create a new instance of the Forum model with the received data
        const newForumPost = new Forum({
            title,
            content,
            tags,
        });

        // Save the new post to the database
        await newForumPost.save();

        // Respond with a success message and the created post object
        res.status(201).json({
            message: "Forum post created successfully!",
            post: newForumPost,
        });
    } catch (error) {
        // If an error occurs, log it and send a 500 status code with an error message
        console.error("Error creating forum post:", error);
        res.status(500).json({
            message: "An error occurred while creating the forum post.",
        });
    }
});

export default router;