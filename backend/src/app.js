import express from "express";
import cors from "cors";
import authRoutes from "./router/auth.route.js";
import blogRoutes from "./router/blog.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// auth routes
app.use("/api/v1/auth", authRoutes);

// blog routes
app.use("/api/v1/blogs", blogRoutes);

export default app;
