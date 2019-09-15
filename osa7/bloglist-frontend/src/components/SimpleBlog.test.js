import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'


test('renders content', () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 10
  }

  const component = render(
    <SimpleBlog blog={blog} onClick={() => console.log('clicked')} />
  )

  let element = component.getByText('Blog title Blog author')
  expect(element).toBeDefined()

  element = component.getByText('blog has 10 likes')
  expect(element).toBeDefined()
})


test('like works', async () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    url: 'hs.fi',
    likes: 10
  }

  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)

})

