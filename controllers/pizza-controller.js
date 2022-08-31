const { Pizza } = require("../models");

const pizzaController = {
  // get all pizzas - GET /api/pizzas
  getAllPizza(req, res) {
    Pizza.find({})
      //to show commentContent Need To populate a field,
      //chain the .populate() method onto your query, passing in an object with the key
      // path plus the value of the field you want populated
      .populate({
        path: "comments",
        //used the select option inside of populate(), to tell Mongoose we dont want __v field
        //on comments either. The minus sign - indicates that we don't want it to be returned.
        //If we didn't have it, it would return only the __v field.
        select: "-__v",
      })
      .select("-__v")
      //use .sort({ _id: -1 }) to sort in DESC order by the _id value. This gets the newest
      //pizza because a timestamp value is hidden somewhere inside the MongoDB ObjectId.
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id - GET /api/pizzas/:id
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create Pizza  - POST /api/pizzas
  //In MongoDB, methods for adding data to a collection are
  // .insertOne() or .insertMany().
  // But in Mongoose, we use the .create() method, which will actually handle either one or multiple inserts!
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },

  // update pizza by id - PUT /api/pizzas/:id
  updatePizza({ params, body }, res) {
    //If we don't set that third parameter, { new: true }, it will return the original document.
    //By setting the parameter to true, we're instructing Mongoose to return the new version of the document.
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete Pizza -  DELETE /api/pizzas/:id
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
