const app = require('../app')
const { connect } = require('../config/mongoose')
const port = process.env.PORT || 5001

//listen
connect().then(() => {
  console.log('MongoDB connected ~')
  app.listen(port, () => console.log(`Server is listening on port ${port}`))
})
