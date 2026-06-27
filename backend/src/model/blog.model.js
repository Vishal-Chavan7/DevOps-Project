import mongoose from "mongoose";

const CATEGORIES = [
    "Design",
    "Technology",
    "Culture",
    "Philosophy",
    "Workflow",
    "Future",
];

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } },
);

const blogSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 4,
            maxlength: 120,
        },
        excerpt: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 280,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 50,
        },
        coverImage: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            enum: CATEGORIES,
        },
        tags: {
            type: [String],
            required: true,
            validate: {
                validator: (v) => Array.isArray(v) && v.length > 0,
                message: "At least one tag is required",
            },
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        readTime: {
            type: Number,
            required: true,
            min: 1,
        },
        comments: {
            type: [commentSchema],
            default: [],
        },
    },
    { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
