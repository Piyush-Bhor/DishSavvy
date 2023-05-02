const axios = require('axios');

const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random';

module.exports = {
    get_detail: (id) => axios({
        method:"GET",
        url : BASE_URL,
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        },
        params: {
            id : id
        }
    })
}