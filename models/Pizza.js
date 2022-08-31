const { Schema, model } = require('mongoose');

//MongoDB provides _id so  you don't have to set it up like you would in SQL. 
//If you wanted to change the name of the _id field— to pizzaId,
//you could override it in Mongoose.
const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
});

//create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

//export the Pizza model
module.exports = Pizza;