const AuthController = require('../controllers/auth')
const router = require('express').Router()
const { upload } = require('../config/multer')

router.post('/register', upload.single('photo'), AuthController.register)
router.post('/login', AuthController.login)

module.exports = router
