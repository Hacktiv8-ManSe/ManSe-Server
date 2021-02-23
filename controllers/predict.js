const predictImage = require('../config/clarifai')

class PredictController {
  static async predictMeal(req, res, next) {
    try {
      const { image_url } = req.body
      const response = await predictImage(image_url, 0.95)
      let meal = []
      response.map(el => meal.push(el.name))
      res.status(200).json(meal)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
  static async predictFridge(req, res, next) {
    try {
      const { image_url } = req.body
      const response = await predictImage(image_url, 0.5)
      let meal = []
      response.map(el => meal.push(el.name))
      res.status(200).json(meal)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  static async findOne() {}
}

module.exports = PredictController
