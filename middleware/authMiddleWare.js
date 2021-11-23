const jwt = require('jsonwebtoken');
const Customer = require('../models/customers');

const requireAuth = (req, res, next) => {

    const token = req.cookies.customer; //setting token object to the req cookie named customer. 

    // check json web token exists & verified
    if (token) {
        jwt.verify(token, 'WEB 601 NMIT', (err, decodedToken) => { //verify the cookie is signed with the same signature as i create the cookie with.
            if (err) {
                console.log(err); //console log any errors
                res.redirect('/login'); //redirect to login if error, in other words, if token named customer isnt found
            } else {
                console.log(decodedToken) //console.log the token
                next(); //continue with rest of code, in this case, show catalog
            }
        }) 
    }
    else {
        res.redirect('/login'); //redirect to login if error, in other words, if token named customer isnt found
    }
}


//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.customer;

    if (token) {
        jwt.verify(token, 'WEB 601 NMIT', async (err, decodedToken) => { //verify the cookie is signed with the same signature as i create the cookie with.
            if (err) {
                console.log(err); //console log any errors
                res.locals.customer = null;
                next(); //if there is no cookie, continue
            } else {
                console.log(decodedToken) //console.log the token
                let customer = await Customer.findById(decodedToken.id);  //calling the Customer schema and using the findbyid method from mongoose, and grabbing the id from the decodedToken
                res.locals.customer = customer;
                next(); //continue with rest of code, in this case, show catalog
            }
        })
    }
    else {
        res.locals.customer = null;
        next();
    }
}

module.exports = { requireAuth, checkUser } //exporting the middleware as 'requireAuth' that can be called in files that require this file.