const MealController = require('../controllers/meal')

const router = require('express').Router()

router.post('/', MealController.add)
router.get('/', MealController.findAll)
router.get('/:id', MealController.findOne)
router.delete('/:id', MealController.delete)

module.exports = router
