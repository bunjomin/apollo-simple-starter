import '@babel/polyfill';
const mocha = require('mocha');
const describe = mocha.describe;
const test = mocha.test;
import { expect } from 'chai';
import { graphql } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema, mockServer } from 'graphql-tools';
import typeDefs from '../graphql/types/';

const queryUsers = {
  id: 'Users',
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

describe('Schema', () => {
  // Array of case types
  const cases = [queryUsers];

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

  test('has valid type definitions', async () => {
    expect(async () => {
      const MockServer = mockServer(typeDefs);

      await MockServer.query(`{ __schema { types { name } } }`);
    }).to.not.throw();
  });

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
