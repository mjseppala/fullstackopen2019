export const showNotification = (text, color, delay) => {
  console.log('barbarbar')
  return async dispatch => {
    console.log('fooofoofoo')
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: { message: text, color }
    })
    setTimeout(() => dispatch({
      type: 'SET_NOTIFICATION',
      notification: null
    }), delay * 1000)
  }
}

const reducer = (state = null, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    default: return state
  }
}

export default reducer
