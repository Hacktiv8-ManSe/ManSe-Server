const request = require('supertest')
const app = require('../app')
const { connect } = require('../config/mongoose')
const { User } = require('../models')
const { generateToken } = require('../helpers/jwt')

// ***** INITIALIZE ***** //
let userInit = {
  photo: 'url',
  email: 'userinit@gmail.com',
  password: '123456',
  name: 'Hani A',
  birthday: '1997-02-21',
  gender: 'female',
  weight: 45,
  height: 150
}
let userRegis = {
  email: 'haniiuserregis@gmail.com',
  password: '123456',
  name: 'Hani A',
  photo: 'url',
  birthday: '1997-02-21',
  gender: 'female',
  weight: 45,
  height: 150
}
let userInvalidEmail = {
  email: 'haniiuserregis',
  password: '123456',
  name: 'Hani A'
}
let userEmpty = {
  email: '',
  password: '',
  name: ''
}
let userInvalidPasswordLength = {
  email: 'haniiuserregis@gmail.com',
  password: '12345',
  name: 'Hani A'
}
let userInvalid = {
  photo: 1, // string
  email: 1, // string not null
  password: 1, //string not null min 8
  name: 1, //string not null min 2
  birthday: '', // date
  gender: 0, // string only female, male, other
  weight: '', // number
  height: '' // number
}
let userUpdate = {
  // photo: 'urlupdated',
  email: 'haniiuserupdate@gmail.com',
  password: '123456update',
  name: 'Hani A Update'
  // birthday: '1997-05-21',
  // gender: 'female',
  // weight: 50,
  // height: 155
}

let userToken, idUser
let unauthorizedUserToken = generateToken({
  _id: 123123,
  email: 'dsudhsudhsdh@mail.com'
})

let emailInit = {
  email: 'mity23@mail.com',
  password: '123456',
  name: 'mity',
  photo: 'sadKEK',
  birthday: '1998-03-12',
  gender: 'male',
  weight: 95,
  height: 174
}

let invalidId = '60332a76af90be5719d6011b'

beforeAll(async done => {
  // coonect to mongo
  await connect()
  request(app)
    .post('/register')
    .set('Accept', 'application/json')
    .send(emailInit)
    .end((err, res) => {
      done()
    })
  done()
})
// Cleans up database between each test
afterAll(async done => {
  await User.deleteMany()
  done()
})

// ==================== GET ==================== //
describe('GET', () => {
  test('Should return default server message', done => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('NutriSee API v1')
        done()
      })
  })
})


// ==================== REGISTER ==================== //
describe('POST /register', () => {
  test('201 Success', done => {
    request(app)
      .post('/register')
      .set('Accept', 'application/json')
      .send(userRegis)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('_id', expect.any(String))
        expect(res.body).toHaveProperty('email', userRegis.email)
        expect(res.body).not.toHaveProperty('password', expect.any(String))
        expect(res.body).toHaveProperty('name', userRegis.name)
        expect(res.body).toHaveProperty('photo', userRegis.photo)
        expect(res.body).toHaveProperty(
          'birthday',
          new Date(userRegis.birthday).toISOString()
        )
        expect(res.body).toHaveProperty('gender', userRegis.gender)
        expect(res.body).toHaveProperty('bmr', expect.any(Number))
        idUser = res.body._id // initialize idUser registered
        done()
      })
  })
  test("400 Failed - Email isn't unique", done => {
    request(app)
      .post('/register')
      .send(userRegis)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty(
          'message',
          'sorry, email has been registered with other account'
        )
        done()
      })
  })
  test('400 - Failed - Invalid email', done => {
    request(app)
      .post('/register')
      .send(userInvalidEmail)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty(
          'message',
          expect.arrayContaining([`Email is invalid`])
        )
        done()
      })
  })
  test('400 Failed - Empty data', done => {
    request(app)
      .post('/register')
      .send(userEmpty)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty(
          'message',
          expect.arrayContaining([
            `email can't be empty`,
            `password can't be empty`,
            `name can't be empty`
          ])
        )
        done()
      })
  })
  test('400 - Failed - Password length not required', done => {
    request(app)
      .post('/register')
      .send(userInvalidPasswordLength)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty(
          'message',
          expect.arrayContaining(['password has to be at least 6 characters'])
        )
        done()
      })
  })
})

// ==================== LOGIN ==================== //
describe('POST /login', () => {
  test('200 - Success', done => {
    request(app)
      .post('/login')
      .send({
        email: userRegis.email,
        password: userRegis.password
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('access_token', expect.any(String))
        userToken = res.body.access_token // initialize userToken logged in
        done()
      })
  })

  test('401 - Failed - Wrong email', done => {
    request(app)
      .post('/login')
      .send({
        email: 'testnotregisteredemail@mail.com',
        password: userRegis.password
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
        done()
      })
  })

  test('401 - Failed - Wrong password', done => {
    request(app)
      .post('/login')
      .send({
        email: userRegis.email,
        password: '1234564wrongps'
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
        done()
      })
  })

  test(`Email which isn't registered in database`, done => {
    request(app)
      .post('/login')
      .send({
        email: 'faketest@mail.com',
        password: 'test123123'
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
        done()
      })
  })

  test(`No email and password input`, done => {
    request(app)
      .post('/login')
      .end((err, res) => {
        if (err) return done(err)
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', `Wrong Email or Password`)
        done()
      })
  })
})

// ==================== READ ==================== //
describe('Read user', function () {
  // ***** TEST ***** //
  it('Success find all users', function (done) {
    request(app)
      .get('/users')
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        done()
      })
  })

  it('Success find one user', function (done) {
    request(app)
      .get('/users/' + idUser)
      .set('access_token', userToken)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) done(err)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        done()
      })
  })
})

// ==================== UPDATE ==================== //
describe(`PUT /users/:id`, () => {
  test(`Success`, done => {
    request(app)
      .put(`/users/${idUser}`)
      .set('access_token', userToken)
      .send(userUpdate)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('_id', expect.any(String))
        expect(res.body).toHaveProperty('email', userUpdate.email)
        expect(res.body).toHaveProperty('password', userUpdate.password)
        expect(res.body).toHaveProperty('name', userUpdate.name)
        expect(res.body).toHaveProperty(
          'birthday',
          new Date(userRegis.birthday).toISOString()
        )
        expect(res.body).toHaveProperty('gender', userRegis.gender)
        expect(res.body).toHaveProperty('bmr', expect.any(Number))
        done()
      })
  })

  test('failed because of invalid token / forbidden', done => {
    request(app)
      .put(`/users/${idUser}`)
      .set('access_token', unauthorizedUserToken)
      .send(userUpdate)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', 'You dont have access!')
        done()
      })
  })

  test("failed because of email isn't unique", done => {
    request(app)
      .put(`/users/${idUser}`)
      .set('access_token', userToken)
      .send({ email: emailInit.email })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty(
          'message',
          'sorry, email has been registered with other account'
        )
        done()
      })
  })

  test('failed because of invalid email', done => {
    request(app)
      .put(`/users/${idUser}`)
      .set('access_token', userToken)
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
        expect(res.body).toHaveProperty('message', [`Email is invalid`])
        done()
      })
  })

  test('failed because of empty data', done => {
    request(app)
      .put(`/users/${idUser}`)
      .set('access_token', userToken)
      .send(userEmpty)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty(
          'message',
          expect.arrayContaining([
            `email can't be empty`,
            `password can't be empty`,
            `name can't be empty`
          ])
        )
        done()
      })
  })

  test('failed because of password length', done => {
    request(app)
      .put(`/users/${idUser}`)
      .set('access_token', userToken)
      .send(userInvalidPasswordLength)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('message', [
          'password has to be at least 6 characters'
        ])
        done()
      })
  })

  test('failed because user not found', done => {
    request(app)
      .put(`/users/${invalidId}`)
      .set('access_token', userToken)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', `user not found!`)
        done()
      })
  })
})

// ==================== DELETE ==================== //
describe(`DELETE /users/:id`, () => {
  test(`Success`, done => {
    request(app)
      .delete(`/users/${idUser}`)
      .set('access_token', userToken)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty(
          'message',
          'Success delete your account'
        )
        // cek if meal also deleted
        done()
      })
  })

  test('failed because of invalid token / forbidden', done => {
    request(app)
      .delete(`/users/${idUser}`)
      .set('access_token', unauthorizedUserToken)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('message', 'You dont have access!')
        done()
      })
  })

  test('failed because user not found', done => {
    request(app)
      .delete(`/users/${invalidId}`)
      .set('access_token', userToken)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        // console.log(res, '<<<<< ')
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', `user not found!`)
        done()
      })
  })
})
