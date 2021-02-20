const router = require('express').Router()
const auth = require('./auth')
const users = require('./users')
const meals = require('./meals')
const Auth = require('../middlewares/Auth')

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'NutriSee API v1' })
})

router.use('/', auth)
router.use(Auth.authentication)
router.use('/users', users)
router.use('/meals', meals)

module.exports = router
