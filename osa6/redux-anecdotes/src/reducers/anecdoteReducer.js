import anecdoteService from '../services/anecdotes'

export const voteAnecdote = id => {
  return async dispatch => {
    await anecdoteService.vote(id)
    dispatch({
      type: 'VOTE', id
    })
  }
}

export const newAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({ type: 'NEW_AN', content: newAnecdote })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data
    case 'VOTE':
      const id = action.id
      const change = state.find(n => n.id === id)
      const newAn = {
        ...change,
        votes: change.votes + 1
      }
      console.log('newAN', newAn)
      return state.map(an => {
        console.log('an.id !== id', an.id !== id)
        return an.id !== id ? an : newAn
      })
    case 'NEW_AN':
      return state.concat(action.content)
    default: return state
  }
}

export default reducer