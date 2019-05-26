export default `
  type User {
    id: Int!
    name: String!
    email: String!
    authToken: String!
  }
  type Query {
    user(id: Int, name: String, email: String, authToken: String): User,
    users: [User],
    getdata(token: String!): User,
  }
  type Mutation {
    authuser(name: String, email: String, password: String!): User,
    createUser(id: Int!, name: String!, email: String!, password: String): User,
    editUser(id: Int, name: String, email: String): User,
    deleteUser(id: Int): User
  }
`;
