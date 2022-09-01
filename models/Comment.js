const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
  {
    //set custom id to avoid confusion with parent comment _id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    replyBody: {
      type: String,
      required: true,
      trim: true,
    },
    writtenBy: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //getters to transform data using utils function dateFormat
      // get: (createdAtVal) => dateFormat(createdAtVal), - this was the original code from module that had bugs with 0
      get: (createdAtVal) => {
        console.log(new Date(createdAtVal).getTime());
        return Intl.DateTimeFormat("en-us", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          // timeStyle: "long",
        }).format(new Date(createdAtVal).getTime());
      },
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
      trim: true,
    },
    commentBody: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //getters to transform data using utils function dateFormat
      // get: (createdAtVal) => dateFormat(createdAtVal), - this was the original code from module that had bugs with 0
      get: (createdAtVal) => {
        console.log(new Date(createdAtVal).getTime());
        return Intl.DateTimeFormat("en-us", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          // timeStyle: "long",
        }).format(new Date(createdAtVal).getTime());
      },
    },
    //associate replies with comments
    //replies will be nested directly in a comment's document and not referred to.
    // use ReplySchema to validate data for a reply
    replies: [ReplySchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Get total count of replies on retrieval (using Virtuals)
CommentSchema.virtual("replyCount").get(function () {
    return this.replies.length;
  });

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
