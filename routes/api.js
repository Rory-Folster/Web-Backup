const express = require('express');
const router = express.Router();
const Customer = require('../models/customers');
const Order = require('../models/order');
const Products = require('../models/products');
const authController = require('../controllers/authController');


//get list of ALL customers from the db
router.get('/customers/all', function(req, res, next){
    Customer.find({}).then(function(Customer){
        res.send(Customer);
    });
});
//get list of catalog
router.get('/products/all', function(req, res, next){
    Products.find({}).then(function(Product){
        res.send(Product);
    });
});

//get products based on id parameter
router.get('/products/:id', function(req, res, next){
    Products.findOne({_id: req.params.id}, req.body).then(function(Product){
        res.send(Product);
    });
});

//add new customer details to db
router.post('/customers', function(req, res, next){
    Customer.create(req.body).then(function(Customer){
        res.send(Customer);
    }).catch(next);
});

//adding new product entry
router.post('/products/new', function(req, res, next){
    Products.create(req.body).then(function(Products){
        res.send(Products);
    }).catch(next);
});

//update existing customer deatils 
router.put('/customers/:id', function(req, res, next){
    Customer.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Customer.findOne({_id: req.params.id}).then(function(Customer){
            res.send(Customer);
        });
    });
});

// //customer adding product to cart *NOT WORKING*
// router.put('/orders/:id', function(req, res, next){
//     Product.findById({_id: req.params.id}).then(function(){
//         Customer.populate('customer.cart', {_id: req.params.id}).then(function(Customer){
//             res.send(Customer)
//         })
//     })
// })


//delete customer details from db
router.delete('/customers/:id', function(req, res, next){
    Customer.findByIdAndRemove({_id: req.params.id}).then(function(Customer){
        res.send(Customer);
    });
})


//get signup page
router.get('/signup', authController.signup_get);

//return new customer details to db
router.post('/signup', authController.signup_post);

//get login page
router.get('/login', authController.login_get);

//authenticate user details
router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get)

module.exports = router;