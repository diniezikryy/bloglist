const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");

blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

blogsRouter.post("/", (req, res, next) => {
  const blog = new Blog(res.body);

  blog.save().then((result) => {
    res.status(201).json(result);
  });
});

// it worked bitch

module.exports = blogsRouter;
