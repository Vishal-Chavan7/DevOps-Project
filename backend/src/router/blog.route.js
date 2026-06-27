import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { createBlog } from "../controller/blog.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createBlog);

export default router;
