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
        recipes : {
            0 : {
                title : "Ramen Noodle Coleslaw",
                image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
            },
            1 : {
                title : "Ramen Noodle Coleslaw",
                image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
            },
            2 : {
                title : "Ramen Noodle Coleslaw",
                image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
            },
            3 : {
                title : "Ramen Noodle Coleslaw",
                image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
            }
        }
    }
    res.render('home',pageData);
});

// get recipe detail
app.get('/detail',(req, res) => {
    var pageData = {
        recipe_title : "Ramen Noodle Coleslaw",
        recipe_image : "https://spoonacular.com/recipeImages/Ramen-Noodle-Coleslaw-556177.jpg",
        recipe_id : 12345
    }
    res.render('recipe_single', pageData );  
});

/* Real Routes 

// home page - random recipes
app.get('/',(req, res) => {
    const recipeAPI = require('./api/recipe_random');
    const async_random = async () => {
        const response = await recipeAPI.get_random_recipe(4,['vegetarian','dessert']);
        var pageData = {
            recipes : response.data.recipes,
        }
        res.render('home',pageData);
    }
    async_random();
});

// get recipe detail
app.get('/detail',(req, res) => {
    const recipeAPI = require('./api/recipe_detail');
    const async_detail = async () => {
        const response = await recipeAPI.get_detail(479101);
        var pageData = {
            recipe_title : response.data.recipes[0].title,
            recipe_image : response.data.recipes[0].image,
            recipe_id : response.data.recipes[0].id
        }
        res.render('recipe_single',pageData);
    }
    async_detail();
});
*/

// add to favorite 
app.get('/add/:id',(req,res) => {
    if(req.session.loggedIn) {
        var username = req.session.username;
        /*var recipe_id = req.query.recipe_id;*/
        var recipe_id = req.params.id;

        User.findOne({username: username}).then((user) => {
            if(user){ 
                user.favorites.push(recipe_id);
                user.save();
                /*res.send("Added!");*/ // only for testing
                console.log("added");
                res.redirect('back');
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

// update details process
app.get('/update/:id', (req,res) => {
    if(req.session.loggedIn) {
        let new_username = req.query.username;
        let new_password = req.query.password;
        User.findOneAndUpdate({username: req.session.username}).then((user) => {
            if(user){ 
                user.username = new_username;
                user.password = new_password;
                user.save();

                var pageData = {
                    update_msg : "Details Updated!",
                    userInfo : user
                }
                res.render('user_info',pageData);
            }
        }).catch((err) => {
            res.send(err);
        });
    }
    else {
        res.redirect('/login');
    }
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
        recipe_id : 12345
    }
    res.render('favourites', pageData);
});

// search page
app.get('/search', (req,res) => {
    res.render('search');
});

// search results
app.get('/search_result',(req,res) => {
    const recipeAPI = require('./api/search_nutrients');
    const async_random = async () => {
        const response = await recipeAPI.search_recipe('pasta',1,50,50,50);
        var pageData = {
            recipe_title : response.data.results[0].title,
            recipe_image : response.data.results[0].image,
        }
        res.render('search',pageData);
    }
    async_random();
})

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