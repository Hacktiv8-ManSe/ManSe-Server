const PredictController = require('../controllers/predict')

const router = require('express').Router()

router.post('/fridge', PredictController.predictFridge)
router.post('/meal', PredictController.predictMeal)

module.exports = router
