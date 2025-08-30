import express from "express";
const router = express.Router();
import Forum from "../models/Forum.js"; // Make sure this path is correct

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