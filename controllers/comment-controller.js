const { Comment, Pizza } = require("../models");

const commentController = {
  //add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          // $push method works the same way in JavaScript—it adds data to an array.
          //All MongoDB-based functions start with ($), making it easier to look at functionality
          // and know what is built-in to MongoDB and what is a custom noun the developer is using.
          { $push: { comments: _id } },
          //When you add data into a nested array of a MongoDB document,
          //they become what's known as a "nested document" or "subdocument".
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  //add reply to comment
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true, }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  // remove reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },

  // Remove comment
  removeComment({ params }, res) {
    //.findOneAndDelete(), works a lot like .findOneAndUpdate(),
    //as it deletes the document while also returning its data.
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deleteComment) => {
        if (!deleteComment) {
          return res.status(404).json({ message: "No Comment with this id!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //We then take that data and use it to identify
          //and remove it from the associated pizza using the Mongo $pull operation.
          { $pull: { comments: params.commentId } },
          // Lastly, we return the updated pizza data,
          //now without the _id of the comment in the comments array,
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        //and we return the updated pizza data to the user.
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
