const mongoose = require("mongoose");
const { registerSchema } = require("swaggiffy");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  content: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  picture: {
    type: {
      image_url: String,
      public_id: String,
    },
    maxlength: 255,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

registerSchema("Post", PostSchema, { orm: "mongoose" });

module.exports = mongoose.model("Post", PostSchema);
