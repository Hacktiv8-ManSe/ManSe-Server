const predictImage = require('../config/clarifai')
const { getImageUrl } = require('../helpers/imgBB')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

class PredictController {
  static async predictMeal(req, res, next) {
    try {
      if (!req.file) {
        next({ statusCode: 400, message: 'You must add some pict!' })
      } else {
        const pathImage = req.file && req.file.path
        const { data } = await getImageUrl(pathImage)
        const imageUrl = data.data.url

        await unlinkAsync(req.file.path) // delete file after upload

        const response = await predictImage(imageUrl, 0.95)
        let meal = []
        response.map(el => meal.push(el.name))
        res.status(200).json(meal)
      }
    } catch (err) {
      next(err)
    }
  }
  static async predictFridge(req, res, next) {
    try {
      if (!req.file) {
        next({ statusCode: 400, message: 'You must add some pict!' })
      } else {
        const pathImage = req.file && req.file.path
        const { data } = await getImageUrl(pathImage)
        const imageUrl = data.data.url

        await unlinkAsync(req.file.path) // delete file after upload

        const response = await predictImage(imageUrl, 0.5)
        let meal = []
        response.map(el => meal.push(el.name))
        res.status(200).json(meal)
      }
    } catch (err) {
      next(err)
    }
  }

  static async findOne() {}
}

module.exports = PredictController
