const request = require('supertest');
// const app = require('../app')
const app = require('../bin/http')

const USER_COLLECTION = process.env.USER_COLLECTION
const {MongoClient} = require('mongodb');

// const { User } = require('../models/index')
const User = require('../models/User')
const { hashPassword, comparePassword} = require('../helpers/bcryptjs')
const { generateToken, verifyToken } = require('../helpers/jwt')

// ***** INITIALIZE ***** //
let user = {
  "photo": "url",
  "email": "hanii@gmail.com",
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

let connection;
let db;

beforeAll(async () => {
  console.log('>>> beforeAll RUNNING');
  connection = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
  });
  db = await connection.db(USER_COLLECTION);
  let data = await User.register(user)
  console.log(data);
});

afterAll(async () => {
  await connection.close();
  await db.close();
});

// beforeAll((done) => {
//   console.log('>>> beforeAll RUNNING');
//   User.register(user)
//   .then((data) => {
//     console.log('>>> beforeAll data=', data);
//     payload = { id: data.ops[0]._id, email: data.ops[0].email }
//     userToken = generateToken(payload)
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
      expect(res.body.message).toEqual('Please Login First')
      // expect(res.body.message).toEqual('Please provide a token!')
      done()
    })
  })
}) 