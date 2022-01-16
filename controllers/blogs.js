const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  try {
    const savedBlog = await blog.save();
    res.status(201);
    res.json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

// it worked bitch

module.exports = blogsRouter;
