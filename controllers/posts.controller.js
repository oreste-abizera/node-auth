const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");
const removeElement = require("../utils/removeElement");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.addPost = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  let picture;
  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    picture = {
      image_url: result.url,
      public_id: result.public_id,
    };
  }
  const user = req.user;
  let post = await Post.create({
    title,
    content,
    picture,
    author: user._id,
    likes: [],
  });
  if (post) {
    return res.status(201).json({
      success: true,
      data: post,
    });
  }
  return next(new ErrorResponse("Post not created", 500));
});

module.exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("author likes");
  if (posts) {
    return res.status(200).json({
      success: true,
      data: posts,
    });
  }
  return res.status(400).json({
    success: false,
    message: "No posts found",
  });
});

module.exports.likePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const user = req.user;
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }
  if (post.likes.includes(user._id)) {
    return next(new ErrorResponse("You already liked this post", 400));
  }
  post.likes.push(user._id);
  await post.save();
  return res.status(200).json({
    success: true,
    data: post,
  });
});

module.exports.getOnePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate("author likes");
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: post,
  });
});

module.exports.updatePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  let post = await Post.findOne({ _id: postId });
  post.title = title;
  post.content = content;
  post = await post.save();
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }
  return res.status(200).json({
    success: true,
    data: post,
  });
});

module.exports.deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }
  return res.status(200).json({
    success: true,
  });
});

module.exports.dislikePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const user = req.user;
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }
  if (!post.likes.includes(user._id)) {
    return next(new ErrorResponse("You haven't liked this post yet", 400));
  }
  removeElement(post.likes, user._id);
  await post.save();
  return res.status(200).json({
    success: true,
    data: post,
  });
});
