const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const {v1: uuid} = require('uuid')
const mongoose  = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = process.env.MONGODB_URI
console.log('Connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connected to MongoDB', error.message)
  })

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
    dummy: Int
  }

  type Mutation {
    addAuthor(
      name: String!
      born: Int
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
  }
`

const resolvers = {
  Query: {
    bookCount : async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // let filteredBooks = books
      // filteredBooks = args.author ? filteredBooks.filter(book => book.author === args.author) : filteredBooks
      // filteredBooks = args.genre ? filteredBooks.filter(book => book.genres.includes(args.genre)) : filteredBooks
      // return filteredBooks
      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount : (root) => books.filter(book => book.author === root.name).length
  },
  Mutation: {
    addAuthor: async (root, args) => {
      const newAuthor = new Author({
        name: args.name, 
        born: args.born,
        id: uuid()
      })
      return newAuthor.save()
    },
    editAuthor: (root, args) => {
      const author = authors.find(author => author.name === args.name)
      const newAuthor = {...author, born: args.setBornTo}
      if (author) {
        authors = authors.map(a => a.name === args.name ? newAuthor: a)
        return newAuthor
      }
      return null
    },
    addBook: async (root, args) => {
      let author = await Author.findOne({name: args.author})
      if (! author) {
        const newAuthor = new Author({
          name: args.author, 
          born: null,
          id: uuid()
        })
        author = await newAuthor.save()
      }
      const newBook = new Book({
        title: args.title,
        author: author._id,
        published: args.published,
        genres: args.genres,
        id: uuid()
      })
      return newBook.save()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})