import React, { useState, useEffect } from 'react'

const Books = (props) => {
  const [visibleGenres, setVisibleGenres] = useState([])
  const [books, setBooks] = useState([])

  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  useEffect(() => {
    const gs = props.books.data.allBooks.flatMap(b => b.genres).filter(onlyUnique).map(g => ({ genre: g, active: true }))
    setVisibleGenres(gs)
    setBooks(props.books.data.allBooks)
  }, [props])

  const visg = visibleGenres.filter(g => g.active === true)
  const visibleBooks = books.filter(b => b.genres.some(g => {
    console.log("foobarfoo", g, visg, visg.includes(g))
    return visg.find(g2 => g2.genre === g)
  }))

  console.log('visiblebooks', visibleBooks, visg, books)

  const toggleGenre = genre => {
    const newGenres = visibleGenres.map(g => g.genre === genre.genre ? { ...g, active: !g.active } : g)
    setVisibleGenres(newGenres)
  }

  if (!props.show) {
    return null
  }

  if (props.books.loading) return <div>loading</div>


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {visibleBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author ? a.author.name : ''}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {visibleGenres.map(g => <button onClick={(event) => toggleGenre(g)}>{g.genre + ' ' + g.active}</button>)}
      </div>
    </div>
  )
}
export default Books