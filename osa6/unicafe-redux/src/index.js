import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const dp = (type) => {
    store.dispatch({
      type
    })
  }

  return (
    <div>
      <button onClick={() => dp('GOOD')}>hyvä</button>
      <button onClick={() => dp('OK')}>neutraali</button>
      <button onClick={() => dp('BAD')}>huono</button>
      <button onClick={() => dp('ZERO')}>nollaa tilastot</button>
      <div>hyvä {store.getState().good}</div>
      <div>neutraali {store.getState().ok}</div>
      <div>huono {store.getState().bad}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
