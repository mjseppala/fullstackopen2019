import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

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

const RenderPersons = ({ entriesToShow }) => (
    <div>
        <h2>Numbers</h2>
        {entriesToShow.map(person =>
            <div key={person.name}>{person.name} {person.number}</div>
        )}
    </div>
)

const App = () => {
    const [persons, setPersons] = useState([])

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                setPersons(response.data)
            })
    }, [])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const [filter, setFilter] = useState('')

    const entriesToShow = filter !== '' ?
        persons.filter(p => p.name.toUpperCase().includes(
            filter.toUpperCase())) : persons

    const submit = event => {
        event.preventDefault()

        if (persons.findIndex(person => person.name === newName) >= 0) {
            alert(`${newName} is already added to phonebook`)
        } else {
            setPersons(persons.concat({ name: newName, number: newNumber }))
            setNewName('')
            setNewNumber('')
        }
    }

    const onFilterChange = event => setFilter(event.target.value)

    return (
        <div>
            <h1>Phonebook</h1>
            <Filter filter={filter} changeHandler={onFilterChange} />
            <AddNew
                handleSubmit={submit}
                newName={newName}
                handleNameChange={event => setNewName(event.target.value)}
                newNumber={newNumber}
                handleNumberChange={event => setNewNumber(event.target.value)}
            />
            <RenderPersons entriesToShow={entriesToShow} />
        </div >
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App

