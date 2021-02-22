const { Meal } = require('../models')

class MealController {
  static async add(req, res, next) {
    try {
      const { id, name, photo, calories } = req.body
      const { _id: user } = req.UserData
      const date_only = new Date().toISOString().substring(0, 10)
      const date = new Date(date_only)
      const response = await Meal.findOneAndUpdate(
        { date, user },
        { $addToSet: { foodEaten: { _id: id, name, photo, calories } } },
        { upsert: true, returnOriginal: false, useFindAndModify: false }
      )
      res.status(201).json(response)
    } catch (err) {
      next(err)
    }
  }
  static async findAll(req, res, next) {
    try {
      const { _id: user } = req.UserData
      const response = await Meal.findOne({ user })
      res.status(201).json(response)
    } catch (err) {
      next(err)
    }
  }
  static async findOne(req, res, next) {
    try {
      const { date } = req.params
      const { _id: user } = req.UserData
      const response = await Meal.findOne({ user, date })
      res.status(200).json(response)
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
        { $pull: { foodEaten: { _id: id } } }
      )
      res.status(201).json({ message: 'meal deleted' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = MealController
