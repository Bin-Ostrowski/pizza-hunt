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
    },
    writtenBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
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
    },
    commentBody: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now.apply,
      get: (createdAtVal) => dateFormat(createdAtVal),
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
