// import dependencies
const express = require('express');
const path = require('path');
require("dotenv").config();
const mongoose = require('mongoose');
const session = require('express-session');
const { userInfo } = require('os');

app = express();

// paths, ejs, and url setup
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:false}));

// database connection
const url = process.env.CONNECTIONSTRING;
mongoose.connect(url, {useNewUrlParser:true}) 
const con = mongoose.connection
con.on('open', ()=> {
    console.log("Database Connnected....");
});

// user model
const User = mongoose.model('User',{
    username : String,
    password : String,
    favorites: [Number]
});

// session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
})); 

// routes

/* Dummy API routes */

// home page - random recipes
app.get('/',(req, res) => {
    var pageData = {
        recipe_title : "Ramen Noodle Coleslaw",
        recipe_image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg"
    }
    res.render('home',pageData);
    
});

// get recipe detail
app.get('/detail',(req, res) => {
    var pageData = {
        recipe_title : "Ramen Noodle Coleslaw",
        recipe_image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
    }
    res.render('recipe_single', pageData );  
});

/*
// home page - random recipes
app.get('/',(req, res) => {
    const recipeAPI = require('./api/recipe_random');
    const async_random = async () => {
        const response = await recipeAPI.get_random_recipe(1,['vegetarian','dessert']);
        var pageData = {
            recipe_title : response.data.recipes[0].title,
            recipe_image : response.data.recipes[0].image,
        }
        res.render('home',pageData);
    }
    async_random();
});

//get 6 results
    const async_random = async () => {
        const response = await recipeAPI.get_random_recipe(6,['vegetarian','dessert']);
        var pageData = response.data.recipes;
        res.render('home', { pageData });
    }
    async_random();

// get recipe detail
app.get('/detail',(req, res) => {
    const recipeAPI = require('./api/recipe_detail');
    const async_detail = async () => {
        const response = await recipeAPI.get_detail(479101);
        var pageData = {
            recipe_title : response.data.recipes[0].title,
            recipe_image : response.data.recipes[0].image,
        }
        res.render('recipe_single',pageData);
    }
    async_detail();
});*/

// get recipes using keywords (havent really tested this yet)
/*ingredients will be an array, when the user
adds a comma they separate eleements */
/*app.get('search',(req, res) => {
    let ingredients = req.body.ingredients;
    const recipeAPI = require('./api/recipe_search');
    const async_detail = async () =>{
        const response = await recipeAPI.get_recipes(9, ingredients);
        var pageData = {
            recipe_title : response.data.recipes[0].title,
            recipe_image : response.data.recipes[0].image,
        }
        res.render('recipe_single',pageData);
    }
});*/

// add to favorite 
app.get('/add',(req,res) => {
    if(req.session.loggedIn) {
        var username = req.session.username;
        var recipe_id = req.query.recipe_id;

        User.findOne({username: username}).then((user) => {
            if(user){ 
                user.favorites.push(recipe_id);
                user.save();
                res.send("Added!"); // only for testing
            }
        }).catch((err) => {
            res.send(err);
        });
    }
    else {
        res.redirect('/login');
    }
});

//user info page
app.get('/user-info', async (req,res) => {
    let username = req.session.username;
    const userInfo = await User.findOne({username: username}).exec();
    res.render('user_info', {userInfo})
});

//user info page -need to fix
app.post('/user-info/:id', async (req,res) => {
    req.session.loggedIn = true;
    let username = req.body.usernames;
    let password = req.body.password;
    let userInfo = username;

    await User.updateOne(
        { username, password },
        { new: true }
      ).exec();

    res.render('account', {userInfo})
});

//account page
app.get('/account', async (req,res) => {
    let username = req.session.username;
    const userInfo = username
    res.render('account', {userInfo});
});

// favourites page
app.get('/favourites', async (req,res) => {
    let username = req.session.username;
    var pageData = {
        userInfo : username,
        recipe_title : "Ramen Noodle Coleslaw",
        recipe_image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
    }
    res.render('favourites', pageData);
});

// search page
app.get('/search', (req,res) => {
    res.render('search');
});

/* login & sign up */
app.get('/signup',(req,res) => {
    res.render('signup_form');
});

app.get('/login',(req,res) => {
    res.render('login_form');
});

/* login process */
app.get('/loginprocess',(req,res) => {
    var username = req.query.username;
    var password = req.query.password;    
    User.findOne({username: username, password: password}).then((user) => {
        if(user){ 
            // save in session
            req.session.username = user.username;
            req.session.loggedIn = true;

            var pageData = {
                login_msg : "Login Successful!",
                userInfo : req.session.username
            }
            res.render('account', pageData);
        }
    }).catch((err) => {
        res.send(err);
    });
}); 

/* logout process */
app.get('/logout',(req,res) => {
    req.session.username = ''; 
    req.session.loggedIn = false;
    var pageData = {
        login_msg : "Logout Successful!"
    }
    res.render('login_form', pageData);
});

/* signup process */
app.get('/signup_process', (req,res) => {
    var username = req.query.username;
    var password = req.query.password;  
    User.findOne({username: username}).then((user) => {
        // check if user exists
        if(user){ 
            var pageData = {
                error_msg : "User Already Exists"
            }
            res.render('signup_form', pageData);
        }
        // create new user
        else {
            var userData = {
                username: username,
                password: password,
                favorites : []
            }
            var newUser = new User(userData);
            newUser.save();
            
            var pageData = {
                signup_msg : "User Created Successfully!"
            }
            res.render('signup_form', pageData);
        }
    }).catch((err) => {
        res.send(err);
    });
});

/* delete account */
app.get('/delete_account/:id',(req,res) => {  
    if(req.session.loggedIn) {
        var username = req.session.username;
        User.findOneAndDelete({username: username}).then((user) => {
            if(user){ 
                //clear session cookies
                req.session.username = ''; 
                req.session.loggedIn = false;
                message = "Account Deleted Successfully!";
                var pageData = {
                    login_msg : message
                }
                res.render('login_form', pageData);
            }
        }).catch((err) => {
            res.send(err);
        });
    }
    else {
        res.redirect('/login');
    }
});

// ------- Application Setup Stuff -------
//        DO NOT PUSH TO PRODUCTION

app.get('/setup',function(req, res){
    var userData = {
        username: process.env.USERNAME, 
        password: process.env.PASSWORD 
    }
    var newUser = new User(userData);
    newUser.save();
    res.send('Done');
});

// server start
app.listen(8080);
console.log('Server running at http://localhost:8080');