process.env.NODE_ENV === 'development' && require('dotenv').config()

const express = require('express')
const app = express()
const port = +process.env.PORT || 5001
const cors = require('cors')
const routers = require('./routers')

//middleware / body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
//routes
app.use(routers)
//listen
app.listen(port, () => console.log(`Server is listening on port ${port}`))

module.exports = app
