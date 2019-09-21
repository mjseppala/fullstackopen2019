import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/react-hooks'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
      title,
      author {
        name,
        born
      },
      genres,
      published
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const ALL_BOOKS = gql`
  {
    allBooks {
      title,
      author {
        name,
        born
      },
      genres,
      published
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`


const CREATE_BOOK = gql`
  mutation addBook(
      $title: String!
      $author: String!
      $published: Int!
      $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title,
      author {
        name,
        born
      }
    }
  }
`

const SET_BIRTH_YEAR = gql`
  mutation editAuthor(
      $name: String!
      $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name,
      born
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const logout = () => {
    setToken(null)
    localStorage.clear()
  }

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    console.log('error', error)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  const client = useApolloClient()

  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, object) =>
      set.map(p => p.title).includes(object.title)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    console.log('datainstore', dataInStore)
    if (!includedIn(dataInStore.allBooks, addedPerson)) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! sending query')
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedPerson) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.bookAdded
      window.alert('person added')
      updateCacheWith(addedPerson)
    }
  })

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
    }
  })

  const [setBirthYear] = useMutation(SET_BIRTH_YEAR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })





  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors
        show={page === 'authors'} authors={authors} setBirthYear={setBirthYear}
      />

      {!books.loading &&
        <Books
          show={page === 'books'} books={books}
        />
      }

      <NewBook
        show={page === 'add'} addBook={addBook}
      />

      <LoginForm
        show={page === 'login'} login={login}
        setToken={(token) => setToken(token)}
      />

    </div>
  )
}

export default App