const mongoose = require('mongoose')

const schema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: 'Users' },
    date: Date,
    foodEaten: [
      {
        id: {
          type: String,
          required: [true, 'Must not contains empty string!']
        },
        name: String,
        image_url: String,
        calories: Number
      }
    ]
  },
  { collection: 'meals' }
)

// schema.pre('save', function (next) {
//   next()
// })

module.exports = mongoose.model('Meals', schema)
