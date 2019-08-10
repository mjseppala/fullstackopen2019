import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import personService from './services/persons'

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

const Filter = ({ filter, changeHandler }) => (
  <div>
    filter shown with
        <input
      value={filter}
      onChange={changeHandler} />
  </div>
)

const AddNew = ({ handleSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <div>
    <h2>add a new</h2>
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName}
          onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber}
          onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

const Persons = ({ entriesToShow, deletePerson }) => (
  <div>
    <h2>Numbers</h2>
    {entriesToShow.map(person =>
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => {
          if (window.confirm(`Delete ${person.name}`)) {
            deletePerson(person.id, person.name)
          }
        }}>
          delete
        </button>
      </div>
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService.getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationData, setNotificationData] = useState(null)

  const entriesToShow = filter !== '' ?
    persons.filter(p => p.name.toUpperCase().includes(
      filter.toUpperCase())) : persons

  const deletePerson = (id, name) => personService
    .deletePerson(id).then(r => {
      showNotification(`Deleted ${name}`, 'green')
      setPersons(persons.filter(p => p.id !== id))
      setNewName('')
      setNewNumber('')
    }).catch(error =>
      showNotification(`Failed to delete ${name}`, 'red')
    )

  const submit = event => {
    event.preventDefault()

    const newObject = { name: newName, number: newNumber }

    const oldPerson = persons.find(person => person.name === newName)
    if (oldPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updateObject = { ...oldPerson, number: newNumber }
        personService.update(oldPerson.id, updateObject).then(r => {
          showNotification(`Updated ${updateObject.name}`, 'green')
          setPersons(persons.map(p => p.id !== oldPerson.id ? p : updateObject))
          setNewName('')
          setNewNumber('')
        }).catch(error =>
          showNotification(`Failed to update ${oldPerson.name}`, 'red')
        )
      }
    } else {
      personService.create(newObject)
        .then(data => {
          showNotification(`Added ${newObject.name}`, 'green')
          setPersons(persons.concat(data))
          setNewName('')
          setNewNumber('')
        }).catch(error =>
          showNotification(`Failed to create ${newObject.name}`, 'red')
        )
    }
  }

  const showNotification = (message, color) => {
    setNotificationData({ message, color })
    setTimeout(() => {
      setNotificationData(null)
    }, 5000)
  }

  const onFilterChange = event => setFilter(event.target.value)

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification data={notificationData} />
      <Filter filter={filter} changeHandler={onFilterChange} />
      <AddNew
        handleSubmit={submit}
        newName={newName}
        handleNameChange={event => setNewName(event.target.value)}
        newNumber={newNumber}
        handleNumberChange={event => setNewNumber(event.target.value)}
      />
      <Persons entriesToShow={entriesToShow} deletePerson={deletePerson} />
    </div >
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App

