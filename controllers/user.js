const User = require('../models/User')
const { comparePassword } = require('../helpers/bcryptjs')
const { generateToken } = require('../helpers/jwt')

class UserController {
  static async register(req, res, next) {
    const { username, email, password, gender, age, weight, height, photo} = req.body
    let recipes = []
    let meals = []
    const payload = { 
      username, email, password, gender, age, weight, height, photo, recipes, meals
    }
    
    try {
      const { ops } = await User.register(payload)
      res.status(201).json(ops[0])
    } 
    catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    const payload = {
      email: req.body.email || '',
      password: req.body.password || ''
    }

    try {
      const user = await User.findOne({
        where: { email:payload.email }
      })

      if (!user) {
        throw {
          status: 401,
          message: `Invalid email / password`
        }
      } 
       else if (comparePassword(payload.password, user.password)) {
        const access_token = generateToken({id:user.id, email:user.email})
        res.status(200).json({access_token, email: payload.email})
       } 
       else {
        throw {
          status: 401,
          message: `Invalid email / password`
        }
       }
    } 
    catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const {id} = req.params
      const { 
        username, email, password, gender, age, weight, height, photo, recipes, meals
      } = req.body
      const newData = { 
        username, email, password, gender, age, weight, height, photo, recipes, meals
      }
      const { value } = await User.update(id, newData)
      res.status(201).json(value)
    } 
    catch (error) {
      next (error)
    }
  }
}

module.exports = UserController