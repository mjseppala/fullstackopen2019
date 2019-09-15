import React from 'react'
import {
  render, waitForElement
} from '@testing-library/react'
import App from './App'

jest.mock('./services/blogs')

describe('<App />', () => {
  test('if no user logged, notes are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('login')
    )

    expect(component.container).toHaveTextContent(
      'username'
    )

    const blogsText = component.queryByText('blogs')
    expect(blogsText).toBe(null)

    const blogTitles = component.container.querySelectorAll('.title')
    expect(blogTitles.length).toBe(0)
  })

  test('if user logged in, notes are rendered', async () => {
    const user = {
      username: 'tester',
      token: '1231231214',
      name: 'Donald Tester'
    }

    localStorage.setItem('user', JSON.stringify(user))

    const component = render(
      <App />
    )

    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('blogs')
    )


    const blogsText = component.queryByText('blogs')
    expect(blogsText).toBeDefined()

    const blogTitles = component.container.querySelectorAll('.title')
    expect(blogTitles.length).toBe(3)
  })

})

