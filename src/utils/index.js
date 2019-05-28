import bcrypt from 'bcrypt';

/**
 * randomIntInc
 * @param {Number} low 
 * @param {Number} high 
 * * Return a pseudo-random int from low - high
 */
const randomIntInc = (low, high) => {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

/**
 * hashPass
 * @param {String} plainPass
 * * Parse a password string into a hash / saltRounds object that we can store
 */
const hashPass = plainPass => {
  return new Promise((resolve, reject) => {
    const saltRounds = randomIntInc(1, 13);
    bcrypt.hash(plainPass, saltRounds, (err, hash) => {
      err ? reject(err) : resolve({ hash });
    });
  });
}

/**
 * generateBase64UUID
 * Original by Briguy37 -- https://stackoverflow.com/users/508537
 * * Returns a random UUID/GUID string
 */
const generateBase64UUID = () => {
  let d = Date.now();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  const date = Date.now();
  return { token: Buffer.from(uuid).toString('base64'), date };
}


module.exports = {
  randomIntInc,
  hashPass,
  generateBase64UUID
};
