const _ = require('lodash')

const dummy = () => 1

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = blogs => blogs.length === 0 ? undefined : blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)

const mostBlogs = blogs => {
  const blogsByAuthor = _.mapValues(_.groupBy(blogs, 'author'), 'length')
  const blogByAuthorArr = _.keys(blogsByAuthor).map(author => ({ author, blogs: blogsByAuthor[author] }))
  return _.maxBy(blogByAuthorArr, a => a.blogs)
}

const mostLikes = blogs => {
  const countLikes = blogs => blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0)
  const likesByAuthor = _.mapValues(_.groupBy(blogs, 'author'), authorBlogs => countLikes(authorBlogs))
  const likesByAuthorArr = _.keys(likesByAuthor).map(author => ({ author, likes: likesByAuthor[author] }))
  return _.maxBy(likesByAuthorArr, a => a.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
