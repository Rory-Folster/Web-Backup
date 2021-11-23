const Customer = require('../models/customers');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '', email: '' };

    // incorrect username
    if (err.message === 'Incorrect username') {
        errors.username = 'That username is not registered'
    }

    // incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'The password entered is incorrect, please try again.'
    }
    

    //duplicate error code
    if (err.code === 11000) {
        errors.email = 'That username or email is already taken! Please try again.'
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    };

    return errors;
}

const tokenAge = 1 * 24 * 60 * 60; //day * hour * minutes * seconds
const createToken = (id) => {
    return jwt.sign({ id }, 'WEB 601 NMIT', {
        expiresIn: tokenAge
    });  //creating token, signing it with the users id from the database, signing it with a secret message and setting its expiry date to the 'tokenAge' variable
}

module.exports.signup_get = (req, res) => { //creating signup module for signup endpoint, rendering signup.ejs file
    res.render('signup');
  }
  
  module.exports.login_get = (req, res) => { //creating signup module for signup endpoint, rendering login.ejs file
    res.render('login');
  }
  
  module.exports.signup_post = async (req, res) => { //creating async function that deconstructs the request into variables
    const { username, password, email } = req.body;

    try {
        const customer = await Customer.create({ username, password, email }); //creating a promise that will await the inputs or values from the front end inputs.
        const token = createToken(customer._id); //creating a token for a newly created account
        res.cookie('customer', token, {httpOnly: true, tokenAge: tokenAge * 1000}) // creating cookie name, passing the token as the value, making the token http only, and setting token expiry.
        res.status(201).json({ customer: customer._id }); 
    }
    catch (err){
        const errors = handleErrors(err); //catching any errors
        res.status(400).json({ errors }); //setting responce status to 400 to tell user it didnt work, also returning the error in json.
    }
  }
  
  module.exports.login_post = async (req, res) => { //login post request handler
    const { username, password } = req.body; //grabbing request body 

    try {
        const customer = await Customer.login(username, password);
        const token = createToken(customer._id); //creating a token for a newly created account
        res.cookie('customer', token, {httpOnly: true, tokenAge: tokenAge * 1000}); // creating cookie name, passing the token as the value, making the token http only, and setting token expiry.
        res.status(200).json( {customer: customer._id } ); //setting the responce status to 200, meaning everything was all good, return json object of the customers id in the db.
    }
    catch (err) {
        const errors = handleErrors(err); //catching any errors
        res.status(400).json({ errors }); //setting responce status to 400 to tell user it didnt work, also returning the error in json.
    }
  }

  module.exports.logout_get = (req, res) => {
      res.cookie('customer', '', { tokenAge: 1 });//checking if user has a 'customer' cookie, if they do, replace the value with empty string, and make new cookie expiry 1ms
      res.redirect('/'); //redirecting the user back to home page
    }
      