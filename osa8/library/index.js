const { ApolloServer, gql, AuthenticationError, UserInputError, PubSub } = require('apollo-server')
const _ = require('lodash')
const uuid = require('uuid/v1')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')


mongoose.set('useFindAndModify', false)

const MONGODB_URI = 'CHANGE_THIS'

// console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    // console.log('connected to MongoDB')
  })
  .catch((error) => {
    // console.log('error connection to MongoDB:', error.message)
  })

const pubsub = new PubSub()

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type AuthorNameWithCount {
    name: String!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [AuthorNameWithCount!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ) : Book

    editAuthor(name: String!, setBornTo: Int!) : Author

    createUser(
      username: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const countBooks = async () => {
  const books = await getBooks()
  const authors = await Author.find({})

  // console.log('count books, books=', books, authors)
  const booksByAuthor = _.mapValues(_.groupBy(books, 'author.name'), 'length')
  // console.log('bba', booksByAuthor)
  const foo = _.keys(booksByAuthor).map(author => {
    const a = authors.find(a => a.name === author)
    return { name: a.name, born: a.born, bookCount: booksByAuthor[author] }
  })
  // console.log('fiifiifii', foo)
  return foo
}

const getBooksByAuthor = async (author, genre) => {
  const books = await getBooks()
  // console.log('get books', books)
  const bks = author ? books.filter(b => b.author === author) : books
  return genre ? bks.filter(b => b.genres.find(g => g === genre)) : bks
}

const getBooks = async () => {
  const books = await Book.find({})
  const authors = await Author.find({})
  return books.map(b => ({ genres: b.genres, _id: b._id, title: b.title, published: b.published, author: authors.find(a => a.id.toString() === b.author.toString()) }))
}

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => getBooksByAuthor(args.author, args.genre),
    allAuthors: () => countBooks(),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const book = new Book({ ...args })

      const author = args.author
      const authors = await Author.find({})
      let authorObj = authors.find(a => a.name === author)
      if (!authorObj) {
        const newAuthor = new Author({ name: author, born: null })
        // console.log('saving new author', newAuthor)
        try {
          newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        authorObj = newAuthor
      }
      book.author = authorObj
      // console.log('saving book', book)
      try {
        const b = await book.save()
        console.log('PUBLISHING', b)
        pubsub.publish('BOOK_ADDED', { bookAdded: b })
        console.log('PUBLISHED', b)
        return b
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const authors = await Author.find({})
      // console.log('edit author', args, authors)
      const author = authors.find(a => a.name === args.name)
      if (!author) return null
      author.born = args.setBornTo
      try {
        return author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

    },
    createUser: (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  // console.log(`Server ready at ${url}`)
  // console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
