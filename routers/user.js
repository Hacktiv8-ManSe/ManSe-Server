const UserController = require('../controllers/user')
const router = require('express').Router()

routes.post('/users/register', UserController.register)
routes.post('/users/login', UserController.login)

module.exports = router