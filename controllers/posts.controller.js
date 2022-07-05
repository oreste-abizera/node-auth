const Post = require("../models/Post");
const { post } = require("../routes/posts.routes");
const removeElement = require("../utils/removeElement");

module.exports.addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = req.user;
    let post = await Post.create({
      title,
      content,
      author: user._id,
      likes: [],
    });
    if (post) {
      return res.status(201).json({
        success: true,
        data: post,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Post not created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.likes.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      });
    }
    post.likes.push(user._id);
    await post.save();
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getOnePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("author likes");
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body
    let post = await Post.findOne({_id: postId})
    post.title = title
    post.content = content
    post = await post.save()
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    } else if (post) {
      return res.status(200).json({
        success: true,
        data: post,
      });
    }
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        status: false
      });
    }
    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
}

module.exports.dislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }
    if (!post.likes.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "Post was not liked before!",
      });
    }
    removeElement(post.likes,user._id)
    await post.save();
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message
    });
  }
}