const axios = require('axios');

const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/';

module.exports = {
    get_detail: (id) => axios({
        method:"GET",
        url : BASE_URL + id + '/information',
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        },
        params: {
            id : id
        }
    })
}