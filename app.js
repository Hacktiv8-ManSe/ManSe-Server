if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const cors = require('cors')
const routers = require('./routers')

//middleware / body parser
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
//routes
app.use(routers)

module.exports = app
