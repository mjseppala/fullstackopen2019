const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

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

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
})

test('id has correct name', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'added blog',
    author: 'Kauko Putki 20',
    url: 'www.blog3.com',
    likes: 9
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(contents).toContain(
    'added blog'
  )
})

test('if likes is not set, 0 is used ', async () => {
  const newBlog = {
    title: 'added blog 2',
    author: 'Kauko Putki 30',
    url: 'www.blog4.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.filter(r => r.title === 'added blog 2')

  expect(contents.length).toBe(1)
  expect(contents[0].likes).toBe(0)
})

test('title missing', async () => {
  const newBlog = {
    author: 'Kauko Putki 30',
    url: 'www.blog4.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('url missing', async () => {
  const newBlog = {
    title: 'added blog 2',
    author: 'Kauko Putki 30'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = (await api.get('/api/blogs')).body
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = (await api.get('/api/blogs')).body

  expect(blogsAtEnd.length).toBe(
    blogsAtStart.length - 1
  )

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})

