const UserController = require('../controllers/user')
const router = require('express').Router()

routes.post('/register', UserController.register)
routes.post('/login', UserController.login)

module.exports = router