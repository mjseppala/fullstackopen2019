import React, { useState, useEffect } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'
import Blog from './components/Blog'
import Togglable from './components/Togglable'

const Notification = ({ data }) => {
  if (data === null) {
    return null
  }

  const { message, color } = data

  const style = {
    color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const CreateNewBlog = ({ addBlog, showNotification, hideForm }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      hideForm()

      const blog = {
        title,
        author,
        url
      }

      addBlog(await blogService.create(blog))

      showNotification('blog created', 'green')
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.error(exception)
      showNotification('blog cration failed', 'red')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title
            <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
            <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
            <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>

    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notificationData, setNotificationData] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    readBlogs()

    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (user) {
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])

  const showNotification = (message, color) => {
    setNotificationData({ message, color })
    setTimeout(() => {
      setNotificationData(null)
    }, 5000)
  }

  const addBlog = (blog) => {
    readBlogs()
  }

  const readBlogs = async () => {
    const bl = await blogService.getAll()
    setBlogs(bl)
  }

  const logout = () => {
    window.localStorage.setItem('user', null)
    setUser(null)

  }



  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      setUser(user)
      setUsername('')
      setPassword('')

      window.localStorage.setItem(
        'user', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      showNotification('logged in', 'green')
    } catch (exception) {
      showNotification('wrong credentials', 'red')
    }
  }


  if (user === null) {
    return (
      <div>
        <Notification data={notificationData} />
        <h2>log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification data={notificationData} />
      <div>
        <Togglable buttonLabel='new blog' ref={blogFormRef} >
          <CreateNewBlog addBlog={addBlog} showNotification={showNotification} hideForm={() => blogFormRef.current.toggleVisibility()} />
        </Togglable>
      </div>

      <h2>blogs</h2>
      <div>{user.name} logged in <button onClick={logout}>logout</button></div>
      {
        blogs.sort((a, b) => b.likes - a.likes).map(blog => {
          return <Blog key={blog.id} blog={blog} readBlogs={readBlogs} showRemove={blog.user.username === user.username} />

        }
        )
      }

    </div>
  )
}
export default App