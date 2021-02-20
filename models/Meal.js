const { ObjectID } = require('mongodb')
const { getDb } = require('../config/mongodb')
const USER_COLLECTION = process.env.USER_COLLECTION

class Meal {
  static database() {
    return getDb().collection(USER_COLLECTION)
  }
  static add(idUser, data) {
    return this.database().findOneAndUpdate(
      { _id: ObjectID(idUser) },
      { $push: { meals: data } }
    )
  }
  static findAll(idUser) {
    return this.database()
      .find({ _id: ObjectID(idUser) })
      .project({ meals: 1, _id: 1 })
      .toArray()
  }
  static findById(idUser, idMeal) {
    return (
      this.database()
        .find({
          $and: [{ _id: ObjectID(idUser) }, { meals: { idMeal: '123456' } }]
        })
        // .find({ _id: ObjectID(idUser) }, { meals: { $elemMatch: { idMeal } } })
        .project({ meals: 1, _id: 1 })
        .toArray()
    )
  }
  static delete(idUser, idMeal) {
    return this.database().findOneAndUpdate(
      { _id: ObjectID(idUser) },
      { $pull: { meals: { idMeal } } }
    )
  }
}

module.exports = Meal
