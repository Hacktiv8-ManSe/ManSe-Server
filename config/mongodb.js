const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'
const dbName = 'NutriSee'
const USER_COLLECTION = process.env.USER_COLLECTION

let db

async function connect() {
  const client = new MongoClient(url, { useUnifiedTopology: true })
  await client.connect()
  db = client.db(dbName)
  indeks()
}

async function indeks() {
  const users = db.collection(USER_COLLECTION)
  const indexEmail = await users.createIndex({ email: 1 }, { unique: true })
  // const indexMeals = await users.createIndex({ meals: 1 })
  // const indexMealId = await users.createIndex(
  //   { 'meals.idMeal': 1 },
  //   { unique: true }
  // )
  console.log(`Index created: ${indexEmail}`)
}

function getDb() {
  return db
}

module.exports = {
  connect,
  getDb
}
