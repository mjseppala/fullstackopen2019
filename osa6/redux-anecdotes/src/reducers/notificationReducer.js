export const showNotification = (text, delay) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      value: text
    })
    setTimeout(() => dispatch({
      type: 'SET_NOTIFICATION',
      value: null
    }), delay * 1000)
  }
}

const reducer = (state = null, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.value
    default: return state
  }
}

export default reducer
