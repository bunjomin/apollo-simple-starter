import '@babel/polyfill';
const mocha = require('mocha');
const describe = mocha.describe;
const test = mocha.test;
import { expect } from 'chai';
import { graphql } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema, mockServer } from 'graphql-tools';
import typeDefs from './index.js';

/**
 * QUERIES
 */
const queryUsers = {
  id: 'User.queries.users',
  query: `
    query {
      users {
        name,
        email,
        authToken
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      users: [{
        name: 'String',
        email: 'String',
        authToken: 'String'
      },
      {
        name: 'String',
        email: 'String',
        authToken: 'String'
      }]
    }
  }
};

const queryUser = {
  id: 'User.queries.user',
  query: `
    query {
      user {
        name,
        email,
        authToken
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      user: {
        name: 'String',
        email: 'String',
        authToken: 'String'
      }
    }
  }
};

const getData = {
  id: 'User.queries.getdata',
  query: `
    query {
      getdata(token: "String") {
        name,
        email,
        authToken
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      getdata: {
        name: 'String',
        email: 'String',
        authToken: 'String'
      }
    }
  }
};
/**
 * QUERIES END
 */

/**
 * RESOLVERS
 */
const createUser = {
  id: 'User.mutations.createUser',
  query: `
    mutation {
      createUser(id: 1, name: "String", email: "String", password: "String") {
        name,
        email,
        authToken
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      createUser: {
        name: 'String',
        email: 'String',
        authToken: 'String'
      }
    }
  }
};

const authUser = {
  id: 'User.mutations.authUser',
  query: `
    mutation {
      authUser(name: "String", password: "String") {
        name,
        email,
        authToken
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      authUser: {
        name: 'String',
        email: 'String',
        authToken: 'String'
      }
    }
  }
};

const editUser = {
  id: 'User.mutations.editUser',
  query: `
    mutation {
      editUser(id: 1, name: "String", email: "String") {
        name,
        email,
        authToken
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      editUser: {
        name: 'String',
        email: 'String',
        authToken: 'String'
      }
    }
  }
};

const deleteUser = {
  id: 'User.mutations.deleteUser',
  query: `
    mutation {
      deleteUser(id: 1) {
        name,
        email
      }
    }
  `,
  variables: {},
  context: {},
  expected: {
    data: {
      deleteUser: {
        name: 'String',
        email: 'String'
      }
    }
  }
};
/**
 * RESOLVERS END
 */

describe('GraphQL Schema', () => {
  // Array of case types
  const cases = [queryUsers, queryUser, getData, createUser, editUser, authUser, deleteUser];

  const mockSchema = makeExecutableSchema({
    typeDefs
  });

  // Here we specify the return payloads of mocked types
  addMockFunctionsToSchema({
    schema: mockSchema,
    mocks: {
      Boolean: () => false,
      ID: () => '1',
      Int: () => 1,
      Float: () => 12.34,
      String: () => 'String',
    }
  });

  // Test Schema
  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs);

      await MockServer.query(`{ __schema { types { name } } }`);
    }).to.not.throw();
  });

  // Test each query
  cases.forEach(obj => {
    const {
      id,
      query,
      variables,
      context: ctx,
      expected
    } = obj;

    test(`query: ${id}`, async () => {
      let response = await graphql(mockSchema, query, null, { ctx }, variables);
      expect(JSON.stringify(response)).to.equal(JSON.stringify(expected));
    });
  });
});
