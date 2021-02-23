const router = require('express').Router()
const auth = require('./auth')
const users = require('./users')
const meals = require('./meals')
const predict = require('./predict')
const recipe = require('./recipe')
const Auth = require('../middlewares/Auth')
const { errorHandlers } = require('../middlewares/errorHandlers')

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'NutriSee API v1' })
})

router.use('/', auth)
router.use(Auth.authentication)
router.use('/users', users)
router.use('/meals', meals)
router.use('/predicts', predict)
router.use('/recipes', recipe)
router.use(errorHandlers)

module.exports = router
