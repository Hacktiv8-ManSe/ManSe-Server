const mongoose = require('mongoose')
const URI = process.env.URI
const DB = process.env.DB_TEST
// const DB = process.env.NODE_ENV === 'test' ? process.env.DB_TEST : process.env.DB_DEV

async function connect() {
  await mongoose.connect(URI + DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
}

module.exports = { connect }
