import User from "../../../models/User";
import { UserInputError, ApolloError, ForbiddenError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { hashPass } from '../../../utils';

/**
 * setAuthToken
 * @param {User} userDoc 
 * * Put our auth token together for the user, store the hash, send it back plain
 */
const setAuthToken = async userDoc => {
  return new Promise((resolve, reject) => {
    userDoc.createToken().then(res => {
      userDoc.authToken = res.token;
      userDoc.authTokenCreated = res.date;
      userDoc.save();
      resolve(userDoc);
    }).catch(err => {
      reject(err);
    });
  });
};

/**
 * checkToken
 * @param {User} userDoc 
 * @param {String} requestToken 
 * * Check that the token hasn't expired, then check if it matches
 */
const checkToken = async (userDoc, requestToken) => {
  return new Promise((resolve, reject) => {
    const activeToken = userDoc.authToken;
    const activeTokenCreated = userDoc.authTokenCreated;
    if (Date.now() - activeTokenCreated < 3600000) {
      // Token is new enough to be used
      if (requestToken === activeToken) {
        setAuthToken(userDoc).then(userDoc => {
          resolve(userDoc);
        }).catch(err => {
          reject(err);
        });
      } else {
        reject(`Invalid auth token!`);
      }
    } else {
      reject(`Auth expired!`);
    }
  });
}

export default {
  Query: {
    getdata: (root, { token }) => {
      return new Promise((resolve, reject) => {
        User.findOne({authToken: token}).exec((err, res) => {
          if (err) reject(new ForbiddenError(`Something went wrong!`));
          else {
            checkToken(res, token).then(userDoc => {
              resolve(userDoc);
            }).catch(err => {
              reject(err);
            });
          }
        });
      });
    },
    user: (root, args) => {
      return new Promise((resolve, reject) => {
        User.findOne(args).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    users: () => {
      return new Promise((resolve, reject) => {
        User.find({})
          .populate()
          .exec((err, res) => {
            err ? reject(new ApolloError(`Something went wrong!`)) : resolve(res);
          });
      });
    }
  },
  Mutation: {
    authuser: (root, { name, email, password }) => {
      return new Promise((resolve, reject) => {
        if (!!password === false) {
          reject(`Password param required to request auth`);
        } else {
          let findBy = { name: name };
          if (!!name === false && !!email && !!password) findBy = { email: email };
          User.findOne({ ...findBy }).exec((err, res) => {
            if (err) {
              reject(err);
            } else {
              const userDoc = res;
              bcrypt.compare(password, res.password, (err, res) => {
                if (err) reject(err);

                else {
                  if (!!res) {
                    // Password was correct, send the data back and set the token
                    setAuthToken(userDoc).then(user => {
                      resolve(user);
                    });
                  } else {
                    reject(new UserInputError(`Invalid password!`));
                  }
                }
              });
            }
          });
        }
      });
    },
    createUser: (root, { id, name, email, password }) => {
      return new Promise((resolve, reject) => {
        hashPass(password).then(authObj => {
          const newUser = new User({ id, name, email, password: authObj.hash });
          newUser.save((err, res) => {
            err ? reject(new ApolloError(`Something went wrong!`)) : resolve(res);
          });
        });
      })
    },
    editUser: (root, { id, name, email, password }) => {
      return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ id }, { $set: { name, email, password } }).exec(
          (err, res) => {
            err ? reject(new ApolloError(`Something went wrong!`)) : resolve(res);
          }
        );
      });
    },
    deleteUser: (root, { id }) => {
      return new Promise((resolve, reject) => {
        User.findOneAndDelete(id).exec((err, res) => {
          err ? reject(new ApolloError(`Something went wrong!`)) : resolve(res);
        });
      });
    }
  }
};
