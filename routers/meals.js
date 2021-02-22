const MealController = require('../controllers/meal')

const router = require('express').Router()

router.post('/', MealController.add)
router.get('/', MealController.findAll) //get by logged user
router.get('/:date', MealController.findOne) // get by date and logged user
router.delete('/:id/:date', MealController.delete) //delete

module.exports = router
