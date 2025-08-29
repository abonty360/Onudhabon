import express from "express";
import ForumPost from "../models/ForumPost.js";

import {
  getForumPosts,
  newForumPost,
  getForumPostById,
  addReply,
} from "../controllers/forumController.js";

const router = express.Router();

router.get("/", getForumPosts); // GET all posts
router.post("/", newForumPost); // POST new post
router.get("/:id", getForumPostById); // GET single post
router.post("/:id/replies", addReply); // POST reply to a post

export default router;
