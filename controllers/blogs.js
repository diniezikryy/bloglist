const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// !! retrieving the data from the database
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

// !! adding single blog post from the database
blogsRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const token = req.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.status(201);
    res.json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

// !! deleting blog post from database
blogsRouter.delete("/:id", async (request, response, next) => {
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);
  console.log(user);

  const blogToDelete = await Blog.findById(request.params.id);

  if (blogToDelete.user.toString() === user._id.toString()) {
    try {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } catch (exception) {
      next(exception);
    }
  } else {
    return response.status(401).json({ error: `Unauthorized` });
  }
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

// !! updating blog post
blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).then(
      (updatedBlog) => {
        response.json(updatedBlog);
        response.status(204).end();
      }
    );
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
