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

//routes
app.get('/',(req, res) => {
    res.render('home');
});

// server start
app.listen(8080);
console.log('Server running at http://localhost:8080');