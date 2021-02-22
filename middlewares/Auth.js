const { verifyToken } = require('../helpers/jwt')
const User = require('../models/User')

class Auth {
  static async authentication(req, res, next) {
    try {
      const { access_token } = req.headers
      if (access_token) {
        let payload = verifyToken(access_token)
        const user = await User.findById(payload._id)
        !user
          ? res.status(404).json({ message: 'user not found!' })
          : ((req.UserData = payload), next())
      } else {
        res.status(401).json({ message: 'Please Login First' })
      }
    } catch (err) {
      // res.status(500).json(err)
      next({
        name: 'InvalidToken'
      })
    }
  }

  static async authorization(req, res, next) {
    try {
      const { id } = req.params
      const user = await User.findById(id)
      // Invalid user. Stranger detected.
      !user
        ? res.status(404).json({ message: 'user not found!' })
        : user._id === id
        ? res.status(403).json({ message: 'You dont have access' })
        : next()
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

module.exports = Auth
