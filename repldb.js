const randchar = require('./randchar');

module.exports.randAdd = async function (db, data) {
  let key = randchar(8);
  db.set(key, data).catch(console.error);
  return key;
}

module.exports.incAdd = async function (db, prefix, num, add) {
  num++;
  db.set(prefix + num, data).catch(console.error);
  return num;
}

module.exports.get = async function (db) {
  
}