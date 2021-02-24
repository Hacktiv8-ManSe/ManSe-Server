const { upload } = require('../config/multer')
const PredictController = require('../controllers/predict')

const router = require('express').Router()

router.post(
  '/fridge',
  upload.single('food_image'),
  PredictController.predictFridge
)
router.post('/meal', upload.single('food_image'), PredictController.predictMeal)

module.exports = router
