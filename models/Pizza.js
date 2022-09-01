const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

//MongoDB provides _id so  you don't have to set it up like you would in SQL.
//If you wanted to change the name of the _id field— to pizzaId,
//you could override it in Mongoose.
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //getters to transform data using utils function dateFormat
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: "Large",
    },
    toppings: [],
    //creating relationship to comment model
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  //tell schema that it can use virturals
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    //set id to false because this is a virtual that Mongoose returns, and we don’t need it
    id: false,
  }
);

// Get total count of comments and replies on retrieval (using Virtuals)
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
  //the .reduce() method to tally up the total of every comment with its replies.
  // In its basic form, .reduce() takes two parameters, an accumulator and a currentValue. 
  //Here, the accumulator is total, and the currentValue is comment. 
  //As .reduce() walks through the array, it passes the accumulating total and the current value
  // of comment into the function, with the return of the function revising the total for the next 
  //iteration through the array.
});

//create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

//export the Pizza model
module.exports = Pizza;
