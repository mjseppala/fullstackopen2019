const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'test blog',
    author: 'Kauko Putki 4',
    url: 'www.blog.com',
    likes: 999
  },
  {
    title: 'test blog 2',
    author: 'Kauko Putki 5',
    url: 'www.blog2.com',
    likes: 100
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}