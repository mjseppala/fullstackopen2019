import React, { useState } from 'react'
import PropTypes from 'prop-types'
import blogs from '../services/blogs'

const Blog = ({ blog, readBlogs, showRemove }) => {
  const [expanded, setExpanded] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = async event => {
    event.preventDefault()
    const newBlog = JSON.parse(JSON.stringify(blog))
    newBlog.user = newBlog.user.id
    newBlog.likes = newBlog.likes + 1
    blog.likes = newBlog.likes
    setLikes(newBlog.likes)
    await blogs.update(newBlog)
    readBlogs()
  }

  const remove = async event => {
    event.preventDefault();
    if (window.confirm(`delete blog ${blog.title} by ${blog.author}?`)) {
      await blogs.deleteBlog(blog.id)
      readBlogs()
    }
  }

  if (!expanded) {
    return (
      <div style={blogStyle}>
        <div onClick={() => setExpanded(true)}>
          {blog.title} {blog.author}
        </div>
      </div>
    )
  }
  return (
    <div style={blogStyle}>
      <div>
        <div onClick={event => {
          event.preventDefault()
          setExpanded(false)
        }}>{blog.title} {blog.author}</div>
        <div>{blog.url}</div>
        <div>{likes} likes <button onClick={addLike}>likes</button></div>
        <div>added by {blog.user.name}</div>
        {
          showRemove && <div><button onClick={remove}>remove</button></div>
        }
      </div>
    </div>
  )

}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  readBlogs: PropTypes.func.isRequired,
  showRemove: PropTypes.bool.isRequired
}

export default Blog