const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

//create customers Schema and model
const CustSchema = new Schema({
    admin: {
        type:Boolean,
        default: false
    },
    username: {
        type:String,
        required: [true, 'A username is required'],
        unique: true
    },
    email: {
        type:String,
        required: [true, 'An email is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type:String,
        required: [true, 'A password is required'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    cart: [{
        type: Schema.Types.ObjectId, ref: 'Order'
    }]
});

//function after doc is saved
CustSchema.post('save', function (doc, next) {
    console.log('new user was created and saved.', doc);
    next();
});

//hashing password before its sent to db.
CustSchema.pre('save', async function (next) {                //using pre method to salt and hash password before it is sent to database.
    const salt = await bcrypt.genSalt();                     //creating 'salt' object that will generate salt for use later.
    this.password = await bcrypt.hash(this.password, salt)  //using the current password about to be sent and adding salt, then hashing using bcrypt
    next();                                                //continue to next, in this case, continue with sending data.
});

//method to log in user
CustSchema.statics.login = async function(username, password) {
    const customer = await this.findOne({ username });       //async function to find 'this' customers username within the database
    if (customer) {                                      //if customer username is found
       const auth = bcrypt.compare(password, customer.password) //hashing the password passed from input so we can compare againest already hashed passwords.
        if (auth) {
            return customer //using the bcrypt method 'compare' we are checking the input password againest customer passwords to see if it exists, if it does return the customer.
        }
        throw Error('Incorrect password'); //error if password is not correct
    }
    throw Error('Incorrect username');                   //if username was not found in database, throw error and return message.
}


const Customer = mongoose.model('Customer', CustSchema);

module.exports = Customer;