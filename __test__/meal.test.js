const request = require('supertest');
const app = require('../app')

const { User, Product } = require('../models/index')
const { hashPassword, comparePassword} = require('../helpers/bcrypt')
const { generateToken, verifyToken } = require('../helpers/jwt')
const models = require('../models/index')

// ***** INITIALIZE ***** //
let user = {
  "_id" : "897hsas7ijsas",
  "photo": "url",
  "email": "hanii@gmail.com",
  "password": "123456",
  "name": "Hani A",
  "age": 17,
  "gender": "female",
  "weight": 45,
  "height": 150,
  "meals": [
    { "idMeal": "idSponnacolar1" },
    { "idMeal": "idSponnacolar2" },
    { "idMeal": "idSponnacolar3" },
    { "idMeal": "idSponnacolar4" }
  ]
}
let user, userToken, idMeal, idSponnacolar
let userToken = generateToken(user)

// beforeAll((done) => {
//   userToken = generateToken(customer)
//   User.bulkCreate(payload)
//   .then((data) => {
//     done()
//   })
//   .catch((err) => {
//     done(err)
//   })
// })

// afterAll((done) => {
//   if(process.env.NODE_ENV === 'test') {
//     User.destroy({where:{}})
//     .then(() => {
//       return User.destroy({where:{}})
//     })
//     .then(() => {
//       done()
//     })
//     .catch((err) => {
//       done(err)
//     })
//   }
// })


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
      expect(res.body.message).toEqual('Please provide a token!')
      done()
    })
  })

  it('Failed create a product with empty string', function(done) {
    const payload = {id: ""}
    request(app)
    .post('/products')
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
      expect(res.body.message).toEqual('Please provide a token!')
      done()
    })
  })
}) 