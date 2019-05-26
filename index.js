import mongoose from "mongoose";
import { db } from "./settings.json";
import schema from './graphql';
import { ApolloServer, gql } from "apollo-server";

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
