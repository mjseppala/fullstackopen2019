import blogService from '../services/blogs'

export const newBlog = blog => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    console.log('dispatcing new blog', newBlog)
    dispatch({ type: 'NEW_BLOG', content: newBlog })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    console.log('dispatching blogs', blogs)
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const like = blog => {
  return async dispatch => {
    const newBlog = JSON.parse(JSON.stringify(blog))
    newBlog.user = newBlog.user.id
    newBlog.likes = newBlog.likes + 1
    await blogService.update(newBlog)
    dispatch({
      type: 'LIKE_BLOG',
      data: blog.id
    })
  }
}

export const remove = blog => {
  return async dispatch => {
    await blogService.deleteBlog(blog.id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: blog.id
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'INIT_BLOGS':
      console.log('INIT BLOGS', state, action)
      return action.data
    case 'LIKE_BLOG':
      const id = action.data
      const change = state.find(n => n.id === id)
      const newAn = {
        ...change,
        likes: change.likes + 1
      }
      return state.map(an => {
        return an.id !== id ? an : newAn
      })
    case 'NEW_BLOG':
      return state.concat(action.content)
    case 'REMOVE_BLOG':
      return state.filter(a => a.id !== action.data)
    default: return state
  }
}

export default reducer