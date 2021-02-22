const mongoose = require('mongoose')

const schema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'Users' },
    date: Date,
    foodEaten: [
      {
        id: String,
        name: String,
        image_url: String,
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
