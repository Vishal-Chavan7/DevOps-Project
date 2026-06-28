import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  addComment,
} from "../controller/blog.controller.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.post("/", verifyToken, createBlog);
router.post("/:id/comments", verifyToken, addComment);
router.get("/:slug", getBlog);
router.put("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

export default router;
