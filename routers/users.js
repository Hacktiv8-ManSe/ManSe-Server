const UserController = require('../controllers/user')
const Auth = require('../middlewares/Auth')

const router = require('express').Router()

router.get('/', UserController.findAll)
router.get('/:id', UserController.findOne)
router.put('/:id', Auth.authorization, UserController.update)
// router.patch('/:id', UserController.update)
router.delete('/:id', Auth.authorization, UserController.delete)

module.exports = router
