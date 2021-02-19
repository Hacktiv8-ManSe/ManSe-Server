const request = require('supertest');
const app = require('../app')
const { hashPassword } = require('../helpers/bcryptjs')

//nyoba beforeAll & afterAll ga bisa @_@

describe(`POST /users/register`, () => {
  test(`Success`, (done) => {
    request(app)
    .post('/users/register')
    .send({
      username: 'tester',
      email: 'test@mail.com',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('username', 'tester')
      expect(res.body).toHaveProperty('gender', 'male')
      done()
    })
  })

  test(`Success2`, (done) => {
    request(app)
    .post('/users/register')
    .send({
      username: 'testerB',
      email: 'testb@mail.com',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('username', 'tester')
      expect(res.body).toHaveProperty('gender', 'male')
      done()
    })
  })

  test("failed because of email isn't unique", (done) => {
    request(app)
    .post('/users/register')
    .send({
      name: 'tester2',
      email: 'test@mail.com',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', 'sorry, email has been registered with other account')
      done()
    })
  })

  test("failed because of invalid email", (done) => {
    request(app)
    .post('/users/register')
    .send({
      name: 'tester3',
      email: 'test3',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', `email is invalid`)
      done()
    })
  })

  test("failed because of empty data", (done) => {
    request(app)
    .post('/users/register')
    .send({
      name: '',
      email: '',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', expect.arrayContaining([
        `name can't be empty`,
        `email can't be empty`,
        `weight can't be empty`
      ]))
      done()
    })
  })

  test("failed because of password length", (done) => {
    request(app)
    .post('/users/register')
    .send({
      name: 'tester4',
      email: 'test4@mail.com',
      password: 'test',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', 'password has to be at least 6 characters')
      done()
    })
  })
})

describe(`POST /users/login`, () => {
  test(`Success`, (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: 'test@mail.com',
      password: 'test123'
    })
    .end((err, res) => {
      if (err) return done(err)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('access_token', expect.any(String))
      done()
    })
  })

  test(`Wrong email`, (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: 'test@mail.com',
      password: 'test123'
    })
    .end((err, res) => {
      if (err) return done(err)
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
      done()
    })
  })

  test(`Wrong password`, (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((err, res) => {
      if (err) return done(err)
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
      done()
    })
  })

  test(`Email which isn't registered in database`, (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: 'faketest@mail.com',
      password: 'test'
    })
    .end((err, res) => {
      if (err) return done(err)
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
      done()
    })
  })

  test(`No email and password input`, (done) => {
    request(app)
    .post('/users/login')
    .end((err, res) => {
      if (err) return done(err)
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
      done()
    })
  })
})

describe(`PUT /users/:id`, () => {
  test(`Success`, (done) => {
    request(app)
    .put('/users/1')
    .send({
      username: 'ms.tester',
      email: 'test@mail.com',
      password: 'test123',
      gender: 'female',
      age: '25',
      weight: '55',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('username', 'ms.tester')
      expect(res.body).toHaveProperty('gender', 'female')
      done()
    })
  })

  test("failed because of email isn't unique", (done) => {
    request(app)
    .put('/users/1')
    .send({
      name: 'tester',
      email: 'testb@mail.com',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', 'sorry, email has been registered with other account')
      done()
    })
  })

  test("failed because of invalid email", (done) => {
    request(app)
    .put('/users/1')
    .send({
      name: 'tester',
      email: 'test',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', `email is invalid`)
      done()
    })
  })

  test("failed because of empty data", (done) => {
    request(app)
    .put('/users/1')
    .send({
      name: '',
      email: '',
      password: 'test123',
      gender: 'male',
      age: '25',
      weight: '',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', expect.arrayContaining([
        `name can't be empty`,
        `email can't be empty`,
        `weight can't be empty`
      ]))
      done()
    })
  })

  test("failed because of password length", (done) => {
    request(app)
    .put('/users/1')
    .send({
      name: 'tester',
      email: 'test@mail.com',
      password: 'test',
      gender: 'male',
      age: '25',
      weight: '65',
      height: '170',
      photo: ''
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', 'password has to be at least 6 characters')
      done()
    })
  })
})