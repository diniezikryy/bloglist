const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  // Creates a root user
  await User.deleteMany({});

  // Creates the blogs
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("Get blog info", () => {
  let headers;

  beforeEach(async () => {
    const newUser = {
      username: "testuser",
      name: "root",
      password: "testuser",
    };

    await api.post("/api/users").send(newUser);

    const result = await api.post("/api/login").send(newUser);

    headers = {
      Authorization: `bearer ${result.body.token}`,
    };
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .set(headers)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("verifies unique identifier property of blog post is named id", async () => {
    const blogs = await Blog.find({});
    expect(blogs[0]._id).toBeDefined();
  });

  test("checks that there are 2 blogs", async () => {
    const resp = await api.get("/api/blogs");

    expect(resp.body).toHaveLength(helper.initialBlogs.length);
  });

  test("checks that the first blog is abt react patterns", async () => {
    const resp = await api.get("/api/blogs");
    const contents = resp.body.map((r) => r.title);
    expect(contents).toContain("React patterns");
  });
});

describe("Functionality of bloglist", () => {
  let headers;

  beforeEach(async () => {
    const newUser = {
      username: "root",
      name: "root",
      password: "root",
    };

    await api.post("/api/users").send(newUser);

    const result = await api.post("/api/login").send(newUser);

    headers = {
      Authorization: `bearer ${result.body.token}`,
    };
  });

  test("a valid blog can be added into the DB", async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .set(headers)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).toContain("Type wars");
  });

  test("a blog without title will not be added", async () => {
    const newBlog = {
      author: "Yeetskra",
      url: "www.gmail.com",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).set(headers).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  }, 10000);

  test("a blog without likes defined will recieve 0 likes by default", async () => {
    const newBlog = {
      title: "how to feed a cat",
      author: "tiara tania",
      url: "www.tiaratania.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .set(headers)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test("succeeds with status code 204 if id is valid", async () => {
    const newBlog = {
      title: "The best blog ever",
      author: "Me",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    await api.post("/api/blogs").send(newBlog).set(headers).expect(201);

    const allBlogs = await helper.blogsInDb();
    const blogToDelete = allBlogs.find((blog) => blog.title === newBlog.title);

    await api.delete(`/api/blogs/${blogToDelete.id}`).set(headers).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((r) => r.title);

    expect(contents).not.toContain(blogToDelete.title);
  });
});

// implement a test that can check if an update is successfully updated

afterAll(() => {
  mongoose.connection.close();
});
