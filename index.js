import mongoose from "mongoose";
import settings from "./settings.json";
import schema from './graphql';
import { ApolloServer, gql } from "apollo-server";

const db = process.env.NODE_ENV === 'production' ? settings.db_prod : settings.db_dev;

// Connect to MongoDB with Mongoose.
mongoose
  .connect(
    db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  schema
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
