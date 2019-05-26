# :fire: Apollo API Simple Starter :fire:

  

### Getting started

- Clone the repo

-  `npm install`

-  [Set up MongoDB](https://docs.mongodb.com/manual/installation/) either locally or on [MongoDB Atlas](https://docs.atlas.mongodb.com/)

-  `cp settings.example.json ./settings.json`

- Open `./settings.json` and change the `db` value to your MongoDB url

-  `npm run server`

  

---

### Using the API

With the default setup, navigate to `localhost:4000` to access the Apollo GraphQL sandbox, which will let you test out queries and mutations. [Check GraphQL docs](https://graphql.org/learn/) to understand how this stuff works.

This server runs as its own process, and you'll run a front-end process that will serve a UI and be the middle-man between the user and the API.

:warning: With that in mind, the overall security of this package depends on how you have it set up, if you expose the GraphQL endpoint to the public, it's not secure at all, so only set this API up to be communicated with locally. :warning:

---

### Notes / What is included?

I think this is a good starting point to branch out and make whatever API you may need for your project. I personally plan to use this as a quick foundation for getting started with whatever hare-brained projects I come up with. The purpose of this API isn

This starter is fairly simple, it contains:

- A simple file/folder setup that should be very extensible.
- Boilerplate Apollo Server & Mongoose stuff out of the way.
- A queryable User with password hashing and authentication token.
- Passwords hashed with bcrypt.
- Random base64 UUID auth tokens that renew on request and expire in 1 hour.

  

**Author**: *Benjamin Harrington* / [bunjomin](https://github.com/bunjomin)