import React, { useState, useEffect } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import { useField } from './hooks'

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

      addBlog(await blogService.create(blog))

      showNotification('blog created', 'green')
      title.reset()
      author.reset()
      url.reset()
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

const App = () => {
  const username = useField('text')
  const password = useField('password')
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
        username: username.form.value, password: password.form.value,
      })

      setUser(user)
      username.reset()
      password.reset()

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