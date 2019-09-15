import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { like, remove as removeBlog } from '../reducers/blogReducer'
import { connect } from 'react-redux'
import {
  Link
} from 'react-router-dom'

const Blog = ({ like, removeBlog, blog, showRemove }) => {
  const [expanded, setExpanded] = useState(false)

  console.log('render blog: ', blog, showRemove)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = async event => {
    event.preventDefault()
    like(blog)
  }

  const remove = async event => {
    event.preventDefault();
    if (window.confirm(`delete blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  if (!expanded) {
    return (
      <div style={blogStyle}>
        <div className='title'>
          <div><Link to={"/blogs/" + blog.id}>{blog.title} {blog.author}</Link></div>
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
        <div>{blog.likes} likes <button onClick={addLike}>likes</button></div>
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
  showRemove: PropTypes.bool.isRequired
}

export default connect(null, { like, removeBlog })(Blog)
