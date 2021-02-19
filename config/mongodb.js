const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const dbName = "ManSe";

let db;
const client = new MongoClient(url, { useUnifiedTopology: true });

function connect(callback) {
  client.connect(function (error) {
    if (error) {
      console.log("MongoDB connection: Error");
    } else {
      console.log("MongoDB is connected");
      db = client.db(dbName);
    }
    callback(error);
  });
}
connect()
function getDb() {
  return db;
}

module.exports = {
  connect,
  getDb,
};