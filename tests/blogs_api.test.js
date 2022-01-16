const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  // Creates the blogs
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("Get blog info", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
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

    await api.post("/api/blogs").send(newBlog).expect(400);

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
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
