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

module.exports = {
  dummy,
  totalLikes,
};
