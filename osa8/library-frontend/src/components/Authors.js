import React, { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!props.show) {
    return null
  }
  if (!props.authors) return null;

  if (props.authors.loading) return <div>loading</div>
  const authors = props.authors.data.allAuthors
  if (!authors) return null

  const submit = async (e) => {
    e.preventDefault()

    let n = name
    if (!name) {
      n = authors[0].name
    }

    await props.setBirthYear({
      variables: { name: n, setBornTo: parseInt(born) }
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>submit</button>
      </form>
    </div >
  )
}

export default Authors