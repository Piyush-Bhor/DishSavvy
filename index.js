// import dependencies
const express = require('express');
const path = require('path');
require("dotenv").config();
const mongoose = require('mongoose');
const session = require('express-session');

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
    username: String,
    password: String
});

// session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
})); 

//routes
app.get('/',(req, res) => {
    const RecepieAPI = require('./api/recepie_random');
    const async_random = async () => {
        const response = await RecepieAPI.get_random_recepie(1,['vegetarian','dessert']);
        var pageData = {
            recepie : response.data[0].title
        }
        res.render('home',pageData);
    }
    async_random();
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
                login_msg : "Login Successful!"
            }
            res.render('login_form', pageData);
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
                password: password
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
app.get('/delete_account',(req,res) => {
    if(req.session.loggedIn) {
        var username = req.session.username;
        User.findOneAndDelete({username:username}).exec(function(err, user){
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