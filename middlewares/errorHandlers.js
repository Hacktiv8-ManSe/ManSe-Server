const errorHandlers = (err, req, res, next) => {
  // console.log(err.name, 'some error msg')
  // console.log(err, 'some error')
  let message = err.message | 'Something went wrong!'
  let statusCode = err.statusCode | 500
  try {
    switch (err.name) {
      case 'MongoError':
        statusCode = 400
        message = 'sorry, email has been registered with other account'
        break
      case 'ValidationError':
        statusCode = 400
        const msg = []
        for (const field in err.errors) {
          const el = err.errors[field]
          msg.push(el.message)
        }
        message = msg
        break
      case 'UnauthorizedError':
        statusCode = 401
        message = 'Wrong Email or Password'
        break
      case 'InvalidToken':
        res.status(403).json({
          message: 'You dont have access!'
        })
        break
      default:
        break
    }
  } catch (err) {
    console.log(err)
  }

  res.status(statusCode).json({ message })
}

module.exports = { errorHandlers }
