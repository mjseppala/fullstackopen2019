import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])

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

    return (
        <div>
            <h1>Phonebook</h1>
            filter shown with <input value={filter} onChange={event => setFilter(event.target.value)} />
            <h2>add a new</h2>
            <form onSubmit={submit}>
                <div>
                    name: <input value={newName}
                        onChange={event => setNewName(event.target.value)} />
                </div>
                <div>
                    number: <input value={newNumber}
                        onChange={event => setNewNumber(event.target.value)} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {entriesToShow.map(person => <div key={person.name}>{person.name} {person.number}</div>)}
        </div >
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App

