import blogService from '../services/blogs'
import loginService from '../services/login'

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('user')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (user) {
        dispatch({
          type: 'SET_USER',
          data: user
        })
        blogService.setToken(user.token)
      }
    }
  }
}

export const login = (username, password, showNotification) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username, password
      })

      dispatch({
        type: 'SET_USER',
        data: user
      })

      window.localStorage.setItem(
        'user', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      showNotification('logged in', 'green', 5)
    } catch (exception) {
      showNotification('wrong credentials', 'red', 5)
    }
  }
}




export const logout = () => {
  return async dispatch => {
    window.localStorage.setItem('user', null)
    blogService.setToken(null)
    dispatch({
      type: 'SET_USER',
      data: null
    })
  }
}


const reducer = (state = null, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'SET_USER':
      return action.data
    default: return state
  }
}

export default reducer