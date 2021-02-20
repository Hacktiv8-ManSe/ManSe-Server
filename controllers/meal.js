const Meal = require('../models/Meal')

class MealController {
  static async add(req, res, next) {
    try {
      const { idMeal } = req.body
      const { _id: idUser } = req.UserData
      const response = await Meal.add(idUser, { idMeal })
      res.status(201).json(response)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  static async findAll(req, res, next) {
    try {
      const { _id: idUser } = req.UserData
      const response = await Meal.findAll(idUser)
      res.status(201).json(response)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  static async findOne(req, res, next) {
    try {
      const { id: idMeal } = req.params
      const { _id: idUser } = req.UserData
      const response = await Meal.findById(idUser, idMeal)
      res.status(200).json(response)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id: idMeal } = req.params
      const { _id: idUser } = req.UserData
      const response = await Meal.delete(idUser, idMeal)
      res.status(201).json(response)
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

module.exports = MealController
