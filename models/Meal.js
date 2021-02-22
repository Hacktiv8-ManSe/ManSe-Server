const mongoose = require('mongoose')

const schema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'Users' },
    date: Date,
    foodEaten: [
      {
        _id: String,
        name: String,
        photo: String,
        calories: Number
      }
    ]
  },
  { collection: 'meals' }
)

schema.pre('save', function (next) {
  next()
})

module.exports = mongoose.model('Meals', schema)
