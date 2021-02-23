const { Meal } = require('../models')

class MealController {
  static async add(req, res, next) {
    try {
      const { id, name, image_url, calories } = req.body
      if (!id || id === '') {
        next({
          name: 'ValidationError',
          errors: { meal: { message: 'Must not contains empty string!' } }
        })
        return
      }
      const { _id: user } = req.UserData
      const date_only = new Date().toISOString().substring(0, 10)
      const date = new Date(date_only)
      const response = await Meal.findOneAndUpdate(
        { date, user },
        { $addToSet: { foodEaten: { id, name, image_url, calories } } },
        { upsert: true, returnOriginal: false, useFindAndModify: false }
      )
      const { user: user_id, date: res_date, foodEaten } = response
      res.status(201).json({
        user: user_id,
        date: res_date,
        foodEaten,
        message: 'Meal created successfully!'
      })
    } catch (err) {
      next(err)
    }
  }

  static async findAll(req, res, next) {
    try {
      const { _id: user } = req.UserData
      const response = await Meal.findOne({ user })
      res.status(200).json({ data: response })
    } catch (err) {
      next(err)
    }
  }

  static async findOne(req, res, next) {
    try {
      const { date } = req.params
      const { _id: user } = req.UserData
      const response = await Meal.findOne({ user, date })
      res.status(201).json({ data: response })
    } catch (err) {
      next(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id, date } = req.params
      const { _id: user } = req.UserData
      const response = await Meal.updateOne(
        { user, date },
        { $pull: { foodEaten: { id } } }
      )
      // res.status(201).json({ message: 'Meal deleted successfully!' })
      response.nModified
        ? res.status(200).json({ message: 'Meal deleted successfully!' })
        : res.status(404).json({ message: 'Data Not Found' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = MealController
