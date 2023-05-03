const axios = require('axios');

const BASE_URL =  'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch';

module.exports = {
    search_recipe: (query,number,maxCarbs,maxSodium,maxSugar) => axios({
        method:"GET",
        url : BASE_URL,
        headers: {
            'X-RapidAPI-Key': process.env.APIKEY,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        },
        params: {
            query: query,
            number : number,
            maxSodium: maxSodium,
            maxCarbs: maxCarbs,
            maxSugar: maxSugar,
        },
    })
}