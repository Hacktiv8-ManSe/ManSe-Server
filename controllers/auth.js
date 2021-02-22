const { User } = require('../models')
const { comparePassword } = require('../helpers/bcryptjs')
const { generateToken } = require('../helpers/jwt')

class AuthController {
  static async register(req, res, next) {
    try {
      const response = await User.create(req.body)
      const {
        _id,
        email,
        name,
        photo,
        birthday,
        gender,
        bodystats,
        bmr
      } = response
      res
        .status(201)
        .json({ _id, email, name, photo, birthday, gender, bodystats, bmr })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
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
        next({ name: 'UnauthorizedError' })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AuthController
