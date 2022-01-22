const blogsRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");

// !! retrieving the data from the database
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// !! adding single blog post from the database
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

// !! deleting blog post from database
blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
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
