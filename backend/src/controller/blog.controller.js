import Blog from "../model/blog.model.js";

const createBlog = async (req, res) => {
    try {
        const { title, excerpt, content, coverImage, category, tags } = req.body;

        if (!title || !excerpt || !content || !coverImage || !category || !tags?.length) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!Array.isArray(tags)) {
            return res.status(400).json({ message: "Tags must be an array" });
        }

        const slugBase = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .slice(0, 80);

        const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(2, Math.round(words / 200));

        const blog = await Blog.create({
            slug,
            title,
            excerpt,
            content,
            coverImage,
            category,
            tags,
            author: req.user.id,
            readTime,
        });

        await blog.populate("author", "name email role");

        const username = blog.author.email.split("@")[0];

        return res.status(201).json({
            id: blog._id.toString(),
            slug: blog.slug,
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            coverImage: blog.coverImage,
            category: blog.category,
            tags: blog.tags,
            authorId: blog.author._id.toString(),
            author: {
                id: blog.author._id.toString(),
                name: blog.author.name,
                username,
                avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`,
                bio: "Member of Chronicle.",
                role: blog.author.role,
            },
            readTime: blog.readTime,
            createdAt: blog.createdAt.toISOString(),
            comments: [],
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { createBlog };
