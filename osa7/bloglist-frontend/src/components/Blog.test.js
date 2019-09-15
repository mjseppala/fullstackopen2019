import React from 'react'
import { render, fireEvent, queryByText } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Blog title',
  author: 'Blog author',
  url: 'hs.fi',
  likes: 10,
  user: {
    name: 'käyttäjänimi'
  }
}

const readBlogs = () => { }

test('initial state shows title and author but nothing else', async () => {
  const { getByText } = render(
    <Blog blog={blog} readBlogs={readBlogs} showRemove={true} />
  )

  const titleAndAuthor = getByText('Blog title Blog author')
  const url = queryByText('hs.fi')
  const likes = queryByText('10')
  const addedBy = queryByText('added by käyttäjänimi')

  expect(titleAndAuthor).toBeDefined()
  expect(url).toBe(null)
  expect(likes).toBe(null)
  expect(addedBy).toBe(null)
})

test('expanded blog shows everything', async () => {


  const component = render(
    <Blog blog={blog} readBlogs={readBlogs} showRemove={true} />
  )

  // fireEvent.click(container.querySelector('.title'))
  const title = component.container.querySelector('.title')
  fireEvent.click(title)

  const titleAndAuthor = component.getByText('Blog title Blog author')

  const url = component.queryByText('hs.fi')
  const likes = component.queryByText('10 likes')
  const addedBy = component.queryByText('added by käyttäjänimi')
  expect(titleAndAuthor).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(addedBy).toBeDefined()
})