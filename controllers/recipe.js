const { default: axios } = require('axios')
const SPOONACULAR_API = process.env.SPOONACULAR_API

let baseUrl = 'https://api.spoonacular.com/recipes/'
class RecipeController {
  static async findByDiet(req, res, next) {
    try {
      const diet = ['vegetarian', 'vegan', 'glutenfree', 'veryHealthy']
      const response = await axios.get(
        baseUrl +
          `random?number=20&diet=${diet}&addRecipeInformation=false&apiKey=${SPOONACULAR_API}`
        // `complexSearch?diet=vegetarian,vegan,glutenfree&addRecipeInformation=true&apiKey=ae1567c7e44b4b748186128672c72144`
      )
      let recipes = []
      response.data.recipes.map(el => {
        const data = {
          id: el.id,
          title: el.title,
          image: el.image,
          readyInMinutes: el.readyInMinutes,
          servings: el.servings,
          summary: el.servings,
          dishTypes: el.dishTypes,
          diets: el.diets,
          healthScore: el.healthScore,
          aggregateLikes: el.aggregateLikes
        }
        recipes.push(data)
      })
      res.status(200).json(recipes)
    } catch (err) {
      next(err)
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.params
      const response = await axios.get(
        baseUrl +
          `${+id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API}`
      )
      res.status(200).json(response.data)
    } catch (err) {
      next(err)
    }
  }

  static async findByIngredients(req, res, next) {
    try {
      const { ingredients } = req.query // array
      const response = await axios.get(
        baseUrl +
          `findByIngredients?ingredients=${ingredients}&apiKey=${SPOONACULAR_API}`
      )
      res.status(200).json(response.data)
    } catch (err) {
      next(err)
    }
  }

  static async findByName(req, res, next) {
    try {
      // console.log('  >>> query=', req.query)
      const name = req.query.query
      // console.log('  >>> name=', name)
      const response = await axios.get(
        baseUrl +
          `complexSearch?query=${name}&addRecipeInformation=true&apiKey=${SPOONACULAR_API}`
      )
      // console.log('  >>> response=', response)
      let recipes = []
      response.data.results.map(el => {
        const data = {
          id: el.id,
          title: el.title,
          image: el.image,
          readyInMinutes: el.readyInMinutes,
          servings: el.servings,
          summary: el.servings,
          dishTypes: el.dishTypes,
          diets: el.diets,
          healthScore: el.healthScore,
          aggregateLikes: el.aggregateLikes
        }
        recipes.push(data)
      })
      res.status(200).json(recipes)
    } catch (err) {
      // console.log(err, '???')
      next(err)
    }
  }
}

module.exports = RecipeController
