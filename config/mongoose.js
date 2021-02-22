const mongoose = require('mongoose')
const URI = process.env.URI
const DB =
  process.env.NODE_ENV === 'test' ? process.env.DB_TEST : process.env.DB_DEV

async function connect() {
  try {
    await mongoose.connect(URI + DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch (err) {
    console.log(err, 'config/mongoose error')
    process.exit()
  }
}

module.exports = { connect }
