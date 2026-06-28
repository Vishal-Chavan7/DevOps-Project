import Blog from "../model/blog.model.js";

function makeSlug(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${base}-${Date.now().toString().slice(-4)}`;
}

function makeReadTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

function formatUser(user) {
  const username = user.email.split("@")[0];
  return {
    id: user._id.toString(),
    name: user.name,
    username,
    avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`,
    bio: "Member of Chronicle.",
    role: user.role,
  };
}

function formatBlog(blog) {
  return {
    id: blog._id.toString(),
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.coverImage,
    category: blog.category,
    tags: blog.tags,
    authorId: blog.author._id.toString(),
    author: formatUser(blog.author),
    readTime: blog.readTime,
    createdAt: blog.createdAt.toISOString(),
    comments: (blog.comments || [])
      .filter((comment) => comment.author?.email)
      .map((comment) => ({
        id: comment._id.toString(),
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        author: formatUser(comment.author),
      })),
  };
}

const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, tags } = req.body;

    if (!title || !excerpt || !content || !coverImage || !category || !tags?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    const blog = await Blog.create({
      slug: makeSlug(title),
      title,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author: req.user.id,
      readTime: makeReadTime(content),
    });

    await blog.populate("author", "name email role");

    return res.status(201).json(formatBlog(blog));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { excerpt: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(filter)
      .populate("author", "name email role")
      .populate("comments.author", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(blogs.map(formatBlog));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "name email role")
      .populate("comments.author", "name email role");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(formatBlog(blog));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this blog" });
    }

    const { title, excerpt, content, coverImage, category, tags } = req.body;

    if (!title || !excerpt || !content || !coverImage || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: "Tags must be a non-empty array" });
    }

    if (blog.title !== title) {
      blog.slug = makeSlug(title);
    }

    blog.title = title;
    blog.excerpt = excerpt;
    blog.content = content;
    blog.coverImage = coverImage;
    blog.category = category;
    blog.tags = tags;
    blog.readTime = makeReadTime(content);

    await blog.save();
    await blog.populate("author", "name email role");
    await blog.populate("comments.author", "name email role");

    return res.status(200).json(formatBlog(blog));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    await blog.deleteOne();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({
      author: req.user.id,
      content: content.trim(),
    });

    await blog.save();
    await blog.populate("author", "name email role");
    await blog.populate("comments.author", "name email role");

    return res.status(201).json(formatBlog(blog));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog, addComment };
