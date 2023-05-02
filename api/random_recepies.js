const axios = require('axios');

const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random'

module.exports = {
    get_random_recepie: (number,tags) => axios({
        method:"GET",
        url : BASE_URL,
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
            'X-RapidAPI-Host': 'weed-strain1.p.rapidapi.com'
        },
        params: {
            number: number,
            tags: tags
        }
    })
}