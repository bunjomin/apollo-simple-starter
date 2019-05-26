import mongoose from "mongoose";
import { hashPass, generateBase64UUID } from "../utils";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  authToken: {
    type: String,
    required: false
  },
  authTokenCreated: {
    type: Number,
    required: false
  }
});

// Generate a random auth token, save, set expiration
UserSchema.methods.createToken = async () => {
  return new Promise((resolve, reject) => {
    const { token, date } = generateBase64UUID();
    resolve({ token, date });
  });
}

const User = mongoose.model("User", UserSchema);

export default User;
