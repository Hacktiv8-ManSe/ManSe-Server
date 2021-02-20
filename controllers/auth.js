const User = require('../models/User')
const { comparePassword, hashPassword } = require('../helpers/bcryptjs')
const { generateToken } = require('../helpers/jwt')

class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, name, age, gender, weight, height } = req.body
      // const user = await User.findByEmail(email)
      // if (!user) {
      const response = await User.register({
        email,
        password: hashPassword(password),
        name,
        age,
        gender,
        weight,
        height,
        meals: []
      })
      res.status(201).json(response)
      // } else {
      //   res.status(400).json({ message: 'Email already exist!' })
      // }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await User.findByEmail(email)
      if (user && comparePassword(password, user.password)) {
        const { _id, email, name, age, weight, height } = user
        const access_token = generateToken({
          _id,
          email,
          name,
          age,
          weight,
          height
        })
        res.status(200).json({ access_token })
      } else {
        res.status(400).json({ message: 'Email or password wrong!' })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

module.exports = AuthController
