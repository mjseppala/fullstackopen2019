import React from 'react';
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteList = props => {

  const vote = id => {
    console.log('vote', id)
    props.voteAnecdote(id)
    const voted = props.visibleAnecdotes.find(an => an.id === id)
    if (voted) {
      props.showNotification('you voted for \'' + voted.content + '\'', 10)
    }
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {
        props.visibleAnecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )
      }
    </div>
  )
}

const anecdotesToShow = ({ anecdotes, filter }) =>
  anecdotes.filter(a => !filter ? true : a.content.includes(filter)).sort((a, b) => b.votes - a.votes)

const mapStateToProps = (state) => {
  return {
    visibleAnecdotes: anecdotesToShow(state)
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  showNotification
}

const ConnectedNotes = connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)
export default ConnectedNotes