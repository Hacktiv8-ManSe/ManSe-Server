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
          ? res.status(401).json({ message: 'Please Login First' })
          : ((req.UserData = payload), next())
      } else {
        res.status(401).json({ message: 'Please Login First' })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  }

  static async authorization(req, res, next) {
    try {
      const { id } = req.params
      const { _id } = req.UserData
      id !== _id ? res.status(403).json({ message: 'Forbidden' }) : next()
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

module.exports = Auth
