const request = require('supertest');
const app = require('../app')
// const app = require('../bin/http')

const USER_COLLECTION = process.env.USER_COLLECTION
const {MongoClient} = require('mongodb');
const { connect } = require('../config/mongodb.js')

// const { User } = require('../models/index')
const User = require('../models/User')
const { hashPassword, comparePassword} = require('../helpers/bcryptjs')
const { generateToken, verifyToken } = require('../helpers/jwt')

// ***** INITIALIZE ***** //
let user = {
  "photo": "url",
  "email": "haniimealtest@gmail.com",
  "password": "123456",
  "name": "Hani A",
  "age": 17,
  "gender": "female",
  "weight": 45,
  "height": 150,
  "meals": []
}
let userToken, idMeal, idSponnacolar
userToken = 'temporary'

let unauthorizedUserToken = generateToken({
  _id: 123123,
  email: "rtyhjkljhgftyuik@mail.com"
})


let connection;
let db;

beforeAll(async done => {
  try {
    await connect()
    await User.register(user)
    const userData = await User.findByEmail(user.email)
    const { _id, email } = userData
    userToken = generateToken({ _id, email })
    done()
  } catch (err) {
    done(err)
  }
})

afterAll(async done => {
  try {
    await User.deleteByEmail(user.email)
    done()
  } catch (err) {
    done(err)
  }
})


// ==================== CREATE ==================== //
describe('Create a new meal', function() {

  // ***** TEST ***** //
  it('Success create a new meal', function(done) {
    const payload = {id: "idSponnacolar123123"}
    request(app)
    .post('/meals')
    .set('access_token', userToken)
    .set('Content-Type', 'application/json')
    .send(payload)
    .end(function(err, res) {
      if (err) done (err);
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('meals')
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Meal created successfully!')
      idMeal = res.body.id
      done()
    })
  })


  it('Failed create a meal without access token', function(done) {
    const payload = {id: "idSponnacolar123123"}
    request(app)
    .post('/meals')
    .set('Content-Type', 'application/json')
    .send(payload)
    .end(function(err, res) {
      if (err) done (err);
      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Please login first!')
      done()
    })
  })

  it('Failed create a meal with empty string', function(done) {
    const payload = {id: ""}
    request(app)
    .post('/meals')
    .set('access_token', userToken)
    .set('Content-Type', 'application/json')
    .send(payload)
    .end(function(err, res) {
      if (err) done (err);
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual(
        expect.arrayContaining(['Must not contains empty string!'])
      )
      done()
    })
  })
})

// // ==================== DELETE ==================== //
describe('Delete a meal', function(){

  // ***** TEST ***** //
  it('Success delete a meal', function(done) {
    request(app)
    .delete(`/meals/${idMeal}`)
    .set('access_token', userToken)
    .set('Content-Type', 'application/json')
    .end(function(err, res) {
      if (err) done (err);
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Meal deleted successfully!')
      done()
    })
  })

  it('Failed delete a product without access token', function(done) {
    request(app)
    .delete(`/meals/${idMeal}`)
    .set('Content-Type', 'application/json')
    .end(function(err, res) {
      if (err) done (err);
      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Please Login First')
      // expect(res.body.message).toEqual('Please provide a token!')
      done()
    })
  })

  it('Failed delete a product with unauthorized access token', function(done) {
    request(app)
    .delete(`/meals/${idMeal}`)
    .set('access_token', unauthorizedUserToken)
    .set('Content-Type', 'application/json')
    .end(function(err, res) {
      if (err) done (err);
      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Unauthorized!')
      done()
    })
  })
}) 