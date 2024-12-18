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
`;

export const ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
      genres
      id
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`;

export const EDIT_AUTHOR_BIRTHYEAR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      id
      born
      bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CURRENT_USER = gql`
  query Me {
    me {
      username
      favoriteGenre
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription BookAdded {
    bookAdded {
      title
      published
      id
      genres
      author {
        born
        id
        bookCount
        name
      }
    }
  }
`;
