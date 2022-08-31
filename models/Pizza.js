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
  return this.comments.length;
});

//create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

//export the Pizza model
module.exports = Pizza;
