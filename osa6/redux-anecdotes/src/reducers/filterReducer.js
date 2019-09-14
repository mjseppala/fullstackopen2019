export const setFilter = value => {
  return {
    type: 'SET_FILTER',
    value
  }
}

const reducer = (state = null, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'SET_FILTER':
      return action.value
    default: return state
  }
}

export default reducer
