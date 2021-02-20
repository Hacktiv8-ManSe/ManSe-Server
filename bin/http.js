const app = require('../app')
const { connect } = require('../config/mongodb')

connect().then(() => {
  console.log('MongoDB connected ~')
  app
})
