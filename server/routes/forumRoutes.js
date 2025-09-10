import express from "express";
const router = express.Router();
import Forum from "../models/Forum.js"; // Make sure this path is correct

// ... (all your other routes like router.get, router.post("/:id/replies", etc. remain unchanged)

// Route to get all forum posts
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // The current page, default is 1
        const limit = parseInt(req.query.limit) || 5; // Number of posts per page, default is 5
        const skip = (page - 1) * limit; // Calculate how many documents to skip

        // Get the total number of posts for calculating total pages
        const totalPosts = await Forum.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await Forum.find({})
            .sort({ createdAt: -1 })
            .skip(skip) // Skip the documents for previous pages
            .limit(limit) // Limit the number of documents returned
            .populate('author', 'name roles');
        // Send back an object with posts and pagination info
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

// Route to get a single forum post by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Forum.findById(id)
            .populate('author', 'name roles') // <-- Populates the main post author
            .populate('replies.author', 'name roles'); // <-- Populates the author within the replies array

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



router.patch("/:id/like", async (req, res) => {
    try {
        const { userId } = req.body; // We'll get the user's ID from the frontend
        const { id } = req.params; // This is the post's ID

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const post = await Forum.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Remove user from dislikes if they are there
        post.dislikes.pull(userId);

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // If they have liked, remove the like (unlike)
            post.likes.pull(userId);
        } else {
            // If they have not liked, add the like
            post.likes.push(userId);
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);

    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Server error while liking post." });
    }
});

// @route   PATCH /api/forum/:id/dislike
// @desc    Dislike or undislike a forum post
router.patch("/:id/dislike", async (req, res) => {
    try {
        const { userId } = req.body; // User's ID
        const { id } = req.params; // Post's ID

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const post = await Forum.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Remove user from likes if they are there
        post.likes.pull(userId);

        // Check if the user has already disliked the post
        const hasDisliked = post.dislikes.includes(userId);

        if (hasDisliked) {
            // If they have disliked, remove the dislike (undislike)
            post.dislikes.pull(userId);
        } else {
            // If they have not disliked, add the dislike
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

        const reply = post.replies.id(replyId); // This is how you find a sub-document by its _id
        if (!reply) {
            return res.status(404).json({ message: "Reply not found." });
        }

        // The logic is the same as for posts, but applied to the 'reply' object
        reply.dislikes.pull(userId);

        const hasLiked = reply.likes.includes(userId);
        if (hasLiked) {
            reply.likes.pull(userId);
        } else {
            reply.likes.push(userId);
        }

        await post.save(); // Save the parent document (the post)
        res.status(200).json(post);

    } catch (error) {
        console.error("Error liking reply:", error);
        res.status(500).json({ message: "Server error while liking reply." });
    }
});

// @route   PATCH /api/forum/:postId/replies/:replyId/dislike
// @desc    Dislike or undislike a specific reply
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


// THIS IS THE ROUTE WE ARE MODIFYING
// Route to handle new forum post submissions
router.post("/", async (req, res) => {
    try {
        // Now we also destructure 'author' from the request body
        const { title, content, tags, author } = req.body;

        // Add a check for the author
        if (!author) {
            return res.status(400).json({ message: "An author is required." });
        }

        // Create a new instance of the Forum model with all the data
        const newForumPost = new Forum({
            title,
            content,
            tags,
            author, // Add the author's ID here
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