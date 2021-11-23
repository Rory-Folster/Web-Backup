const { application } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/api');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleWare');


// set up express app
const WEB_App = express();

//middleware
WEB_App.use(express.static('public'))
WEB_App.use(express.json());
WEB_App.use(cookieParser());

//setting the view engine
WEB_App.set('view engine', 'ejs');

//creating connecting string for mongodb
const dbUrl = 'mongodb+srv://rory:dbPass123@webapp.w10ux.mongodb.net/WebApp'
mongoose.connect(dbUrl)
    .then((result) => WEB_App.listen(4000), console.log('Now Listening'))
    .catch((err) => console.log(err));


//initialize routes

//applying to all get requests, then using the checkUser middleware
WEB_App.get('*', checkUser);

WEB_App.use('/api', require('./routes/api'));
WEB_App.get('/', (req, res) => res.render('home'));
WEB_App.get('/catalog', requireAuth, (req, res) => res.render('catalog'))
WEB_App.get('/ali', requireAuth, (req, res) => res.render('ali'))
WEB_App.use(authRoutes);

//error handling middleware
WEB_App.use(function(err, req, res, next){
    console.log(err)
    res.status(418).send({error: err._message}) //returning any errors within the api requests.
});

//request handler
WEB_App.get('/api', function(req, res){  //request handler that makes all api routes, start with /api/<route>.
})
