const mongoose = require('mongoose')
const { hashPassword } = require('../helpers/bcryptjs')
const { bmr: getBmr } = require('../helpers/bmr')

const schema = mongoose.Schema(
  {
    photo: { type: String, default: '' },
    email: {
      type: String,
      // required: [true, 'You need this!'],
      required: [true, `email can't be empty`],
      unique: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v)
        },
        // message: props => `${props.value} is not a valid email!`
        message: props => `Email is invalid`
      }
    },
    password: {
      type: String,
      // required: [true, 'No password? Are you sure?'],
      required: [true, `password can't be empty`],
      // minLength: [6, 'Too short.'],
      minLength: [6, 'password has to be at least 6 characters']
    },
    name: {
      type: String,
      // required: [true, 'Your name..'],
      required: [true, `name can't be empty`],
      minLength: [2, 'Please at least 2 characters']
    },
    birthday: { type: Date, default: new Date('1997-01-01') },
    gender: {
      type: String,
      enum: ['female', 'male', 'others'],
      default: 'others'
    },
    bodystats: {
      weight: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    },
    bmr: { type: Number, default: 0 }
  },
  { collection: 'users' }
)

schema.pre('save', function (next) {
  this.password = hashPassword(this.password)
  this.bmr = getBmr(
    this.birthday,
    this.bodystats.weight,
    this.bodystats.height,
    this.gender
  )
  this.birthday = new Date(this.birthday)
  next()
})

module.exports = mongoose.model('Users', schema)
