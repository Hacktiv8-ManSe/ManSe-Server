const { ObjectID } = require('mongodb')
const { getDb } = require('../config/mongodb')
const USER_COLLECTION = process.env.USER_COLLECTION

class User {
  static database() {
    return getDb().collection(USER_COLLECTION)
  }
  static register(data) {
    return this.database().insertOne(data)
  }
  static findAll() {
    return this.database().find().toArray()
  }
  static findById(id) {
    return this.database().findOne({ _id: ObjectID(id) })
  }
  static findByEmail(email) {
    return this.database().findOne({ email })
  }
  static update(id, data) {
    return this.database().findOneAndUpdate(
      { _id: ObjectID(id) },
      { $set: data }
    )
  }
  static delete(id) {
    return this.database().deleteOne({ _id: ObjectID(id) })
  }
  static deleteByEmail(email) {
    return this.database().deleteOne({ email })
  }
}

module.exports = User