const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  var numOfLikes = 0;

  for (let i = 0; i < blogs.length; i++) {
    numOfLikes += blogs[i].likes;
  }

  return numOfLikes;
};

// returns the number of likes of the most liked blog
const favouriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce(
        (mostLikedBlog, blog) =>
          blog.likes > mostLikedBlog ? blog.likes : mostLikedBlog,
        blogs[0].likes
      );
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
