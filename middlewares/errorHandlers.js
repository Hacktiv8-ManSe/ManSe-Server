const errorHandlers = (err, req, res, next) => {
  // console.log(err.name, 'some error msg')
  console.log(err.message, 'some error')
  let message = err.message | 'Something went wrong!'
  let statusCode = err.statusCode | 500
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
      statusCode = 403
      message = 'You dont have access!'
      break
    default:
      statusCode = 500
      message = 'Internal server error!'
      break
  }

  res.status(statusCode).json({ message })
}

module.exports = { errorHandlers }
