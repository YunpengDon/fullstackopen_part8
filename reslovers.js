const { PubSub } = require("graphql-subscriptions");
const { v1: uuid } = require("uuid");
const { GraphQLError } = require("graphql");

const jwt = require("jsonwebtoken");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filters = {};

      // filter the book by author's name, if the author's name cannot be found in the database, returen an empty array directly
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filters = { ...filters, author: author._id };
        } else {
          return [];
        }
      }

      // filter the book by genre
      filters = args.genre ? { ...filters, genres: args.genre } : filters;

      return Book.find(filters).populate("author");
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id });
    },
  },
  Mutation: {
    addAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const newAuthor = new Author({
        name: args.name,
        born: args.born,
        id: uuid(),
      });

      try {
        await newAuthor.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              validationErrors: error.errors,
            },
          });
        }
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return newAuthor;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (author) {
        try {
          author.born = args.setBornTo;
          await author.save();
          return author;
        } catch (error) {
          throw new GraphQLError("Edit author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          });
        }
      }
      return null;
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      try {
        let author = await Author.findOne({ name: args.author });
        if (!author) {
          const newAuthor = new Author({
            name: args.author,
            born: null,
            id: uuid(),
          });
          author = await newAuthor.save();
        }
        const newBook = new Book({
          title: args.title,
          author: author._id,
          published: args.published,
          genres: args.genres,
          id: uuid(),
        });
        await newBook.save();
        pubsub.publish("BOOK_ADDED", { bookAdded: newBook });
        return newBook.populate("author");
      } catch (error) {
        throw new GraphQLError("Saving books failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
    },
    createUser: async (root, args) => {
      if (!args.username || !args.favoriteGenre) {
        throw new GraphQLError(
          "username and favoriteGenre should not be empty",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: {
                username: args.username,
                favoriteGenre: args.favoriteGenre,
              },
            },
          },
        );
      }
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        id: uuid(),
      });
      try {
        await user.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              validationErrors: error.errors,
            },
          });
        }
        throw new GraphQLError("Saving user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToekn = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToekn, process.env.SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
