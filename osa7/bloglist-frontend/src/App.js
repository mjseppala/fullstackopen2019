import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route, Link
} from 'react-router-dom'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import { useField } from './hooks'
import { showNotification } from './reducers/notificationReducer'
import Notification from './components/Notification'
import { initializeBlogs, newBlog } from './reducers/blogReducer'
import { initializeUser, login, logout } from './reducers/userReducer'
import { connect } from 'react-redux'

const CreateNewBlogPre = ({ newBlog, showNotification, hideForm }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      hideForm()

      const blog = {
        title: title.form.value,
        author: author.form.value,
        url: url.form.value
      }

      newBlog(blog)

      showNotification('blog created', 'green', 5)
      title.reset()
      author.reset()
      url.reset()
    } catch (exception) {
      console.error(exception)
      showNotification('blog cration failed', 'red', 5)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title
            <input {...title.form} />
        </div>
        <div>
          author
            <input {...author.form} />
        </div>
        <div>
          url
            <input {...url.form} />
        </div>
        <button type="submit">create</button>
      </form>

    </div>
  )
}

const CreateNewBlog = connect(null, { newBlog })(CreateNewBlogPre)

const App = props => {
  const username = useField('text')
  const password = useField('password')

  const blogFormRef = React.createRef()

  const { initializeBlogs, initializeUser } = props
  useEffect(() => {
    initializeUser()
    initializeBlogs()
  }, [initializeBlogs, initializeUser])


  const handleLogin = async (event) => {
    event.preventDefault()
    props.login(username.form.value, password.form.value, props.showNotification)
    username.reset()
    password.reset()
  }

  if (props.user === null) {
    return (
      <div>
        <Notification />
        <h2>log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input {...username.form} />
          </div>
          <div>
            password
            <input {...password.form} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Router>
        <Notification />
        <div>
          <span><Link to="/">blogs</Link> </span>
          <span><Link to="/users">users</Link> </span>
          <span>{props.user.name} logged in <button onClick={props.logout}>logout</button> </span>
        </div>
        <div>
          <Togglable buttonLabel='new blog' ref={blogFormRef} >
            <CreateNewBlog showNotification={props.showNotification} hideForm={() => blogFormRef.current.toggleVisibility()} />
          </Togglable>
        </div>

        <h2>blogs</h2>
        <Route exact path="/" render={() => {
          return (<div>
            {props.blogs.sort((a, b) => b.likes - a.likes).map(blog => {
              return <Blog key={blog.id} blog={blog} showRemove={blog.user.username === props.user.username} />
            })}
          </div>)
        }
        } />
        <Route exact path="/users" render={() => {
          const ByUser = () => props.blogs.reduce((arr, blog) => {

            let byUser = arr.find(a => a.name === blog.user.name)
            if (!byUser) {
              byUser = { id: blog.user.id, name: blog.user.name, count: 1 }
              arr.push(byUser)
            } else {
              byUser.count++
            }
            return arr;
          }, []).map(user => <div key={user.name}><Link to={"/users/" + user.id}>{user.name}</Link> {user.count}</div>)
          return (
            <div>
              <h2>Users</h2>
              <ByUser />
            </div>
          )
        }
        } />
        <Route path="/users/:id" render={({ match }) => {
          const obj = props.blogs.find(p => p.user.id === match.params.id)
          if (!obj) return null
          const ByUser = () => props.blogs.filter(b => b.user.id === match.params.id).map(blog => <div key={blog.title}>{blog.title}</div>)
          return (
            <div>
              <h2>{obj.user.name}</h2>
              <ByUser />
            </div>
          )
        }
        } />
        <Route path="/blogs/:id" render={({ match }) => {
          const obj = props.blogs.find(p => p.id === match.params.id)
          if (!obj) return null
          console.log('93939393939', obj)
          return (
            <div>
              <h2>{obj.title}</h2>
              <div>{obj.url}</div>
              <div>{obj.likes} likes</div>
              <div>added by {obj.user.name}</div>
            </div>
          )
        }
        } />

      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user
  }
}

const mapDispatchToProps = {
  showNotification,
  initializeBlogs,
  initializeUser,
  login,
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(App)