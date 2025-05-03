// schemas/typeDefs.ts

export const typeDefs = `#graphql
  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: String!
    user: User!
  }

  input BookInput {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  # Types for Google Books API data
  type ImageLinks {
    thumbnail: String
  }

  type VolumeInfo {
    title: String
    authors: [String]
    description: String
    imageLinks: ImageLinks
  }

  type GoogleBook {
    id: String
    volumeInfo: VolumeInfo
  }

  type Query {
    me: User
    searchBooks(query: String!): [GoogleBook]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

// export default typeDefs;