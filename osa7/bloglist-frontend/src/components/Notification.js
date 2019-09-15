import React from 'react'
import { connect } from 'react-redux'

const Notification = props => {
  console.log('renderöi notskua', props)
  if (props.notification === null) {
    return null
  }

  const { message, color } = props.notification

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

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification
