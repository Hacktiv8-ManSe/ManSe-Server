const RecipeController = require('../controllers/recipe')
const router = require('express').Router()

router.get('/', RecipeController.findByDiet) // get all recipe by diet
router.get('/findByIngredients', RecipeController.findByIngredients) // get recipe by ingridients
router.get('/findByName', RecipeController.findByName) // get recipe by ingridients
router.get('/:id', RecipeController.findById) // get recipe by id

module.exports = router
