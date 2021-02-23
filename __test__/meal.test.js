const request = require('supertest')
const app = require('../app')
const { connect } = require('../config/mongoose')
const { User } = require('../models')
const { generateToken } = require('../helpers/jwt')

let user = {
  email: 'haniitestmeals@gmail.com',
  password: '123456',
  name: 'Hani A',
  photo: 'url',
  birthday: '1997-02-21',
  gender: 'female',
  weight: 45,
  height: 150
}
let meal = {
  id: 'idSpoon1',
  name: 'Pizza',
  photo: 'pizza.jpg',
  calories: 400
}

let userToken
let idMeal = meal.id
let dateMealCreate

let unauthorizedUserToken = generateToken({
  _id: '123123',
  email: 'rtyhjkljhgftyuik@mail.com'
})

beforeAll(async done => {
  try {
    await connect()
    await User.create(user)
    const userData = await User.findOne({ email: user.email })
    const { _id, email } = userData
    userToken = generateToken({ _id, email })
    done()
  } catch (err) {
    done(err)
  }
})

afterAll(async done => {
  try {
    await User.deleteMany()
    done()
  } catch (err) {
    done(err)
  }
})

// ==================== CREATE ==================== //
describe('Create a new meal', function () {
  // ***** TEST ***** //
  it('Success create a new meal', function (done) {
    request(app)
      .post('/meals')
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .send(meal)
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual('Meal created successfully!')
        dateMealCreate = res.body.date.substring(0, 10)
        done()
      })
  })

  it('Failed create a meal without access token', function (done) {
    request(app)
      .post('/meals')
      .set('Content-Type', 'application/json')
      .send(meal)
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Please Login First')
        done()
      })
  })

  it('Failed create a meal with empty string', function (done) {
    const payload = { id: '' }
    request(app)
      .post('/meals')
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .send(payload)
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual(
          expect.arrayContaining(['Must not contains empty string!'])
        )
        done()
      })
  })
})

// ==================== READ ==================== //
describe('Read the meals', function () {
  // ***** TEST ***** //
  it('Success find all meals', function (done) {
    request(app)
      .get('/meals')
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        done()
      })
  })

  it('Failed find all meals without access token', function (done) {
    request(app)
      .get('/meals')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Please Login First')
        done()
      })
  })

  it('Success find one meal', function (done) {
    request(app)
      .get(`/meals/${dateMealCreate}`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('data')
        done()
      })
  })

  it('Failed find one meal without access token', function (done) {
    request(app)
      .get(`/meals/${dateMealCreate}`)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Please Login First')
        done()
      })
  })

})

// ==================== DELETE ==================== //
describe('Delete a meal', function () {
  // ***** TEST ***** //
  it('Success delete a meal', function (done) {
    request(app)
      .delete(`/meals/${idMeal}/${dateMealCreate}`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Meal deleted successfully!')
        done()
      })
  })

  it('Failed not found', function (done) {
    request(app)
      .delete(`/meals/${idMeal}/2020-01-01`)
      .set('Content-Type', 'application/json')
      .set('access_token', userToken)
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Data Not Found')
        done()
      })
  })

  it('Failed delete a product without access token', function (done) {
    request(app)
      .delete(`/meals/${idMeal}/2020-09-09`)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('Please Login First')
        // expect(res.body.message).toEqual('Please provide a token!')
        done()
      })
  })

  it('Failed delete a product with unauthorized access token', function (done) {
    request(app)
      .delete(`/meals/${idMeal}/2020-09-09`)
      .set('access_token', unauthorizedUserToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(403)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('You dont have access!')
        done()
      })
  })
})

// ==================== THIRD party API ==================== //
describe('Third party API', function () {
  // ***** PREDICT - CLARIFAI ***** //
  it('Success POST /predicts/fridge', function (done) {
    const payload = {image_url: "https://i1.wp.com/blog.hellofresh.com/wp-content/uploads/2017/01/meal-kit-box-fridge-square.jpg?resize=1024%2C939&ssl=1"}
    request(app)
      .post(`/predicts/fridge`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .send(payload)
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
          expect.arrayContaining([])
        )
        done()
      })
  })

  it('Success POST /predicts/meal', function (done) {
    const payload = {image_url: "https://www.qsrmagazine.com/sites/default/files/styles/story_page/public/phut_0.jpg?itok=h30EAnkk"}
    request(app)
      .post(`/predicts/meal`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .send(payload)
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
          expect.arrayContaining([])
        )
        done()
      })
  })

  // ***** RECIPES - SPONNACULAR ***** //
  it('Success GET /recipes', function (done) {
    request(app)
      .get(`/recipes`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        done()
      })
  })

  it('Success GET /findByIngredients', function (done) {
    const ingredients = 'potato,milk'
    request(app)
      .get(`/recipes/findByIngredients?ingredients=${ingredients}`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
          expect.arrayContaining([])
        )
        done()
      })
  })

  it('Success GET /findByName', function (done) {
    const name = 'chick'
    request(app)
      .get(`/recipes/findByName?query=${name}`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
          expect.arrayContaining([])
        )
        done()
      })
  })

  it('Success GET /:id', function (done) {
    const id = 195438
    request(app)
      .get(`/recipes/${id}`)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
          expect.arrayContaining([])
        )
        done()
      })
  })


})