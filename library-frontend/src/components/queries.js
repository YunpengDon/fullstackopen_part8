import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
query AllAuthors {
  allAuthors {
    name
    id
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query AllBooks {
  allBooks {
    title
    published
    author {
      name
    }
  }
}
`

export const ADD_BOOK = gql`
mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    published
    author
    id
    genres
  }
}
`

export const EDIT_AUTHOR_BIRTHYEAR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    id
    born
    bookCount
  }
}
`