const User = require('../models/User')

class UserController {
  static async findAll(req, res, next) {
    try {
      const users = await User.findAll()
      res.status(200).json(users)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  static async findOne(req, res, next) {
    try {
      const { id } = req.params
      const user = await User.findById(id)
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params
      const { email, password, name, age, gender, weight, height } = req.body
      const response = await User.update(id, req.body)
      res.status(200).json(response)
    } catch (err) {
      res.status(500).json(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params
      // const { _id: id } = req.UserData
      const response = await User.delete(id)
      res.status(200).json(response)
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

module.exports = UserController
