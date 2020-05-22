const express = require ('express');
const router = express.Router ();
const auth = require ('../../middleware/auth');
const User = require ('../../models/User');
const Post = require ('../../models/Post');
const Profile = require ('../../models/Profile');
const {check, validationResult} = require ('express-validator');

// @route post /api/post
// @desc add a post
// @access private
router.post (
  '/',
  [auth, [check ('text', 'Text is required!').not ().isEmpty ()]],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    try {
      const user = await User.findById (req.user.id).select ('-password');
      const newPost = new Post ({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save ();
      res.json (post);
    } catch (error) {
      console.error (error.message);
      return res.status (500).send ('Server Error!');
    }
  }
);

// @route GET /api/post
// @desc get all post
// @access private

router.get ('/', auth, async (req, res) => {
  try {
    const posts = await Post.find ().sort ({date: -1});
    res.json (posts);
  } catch (error) {
    console.error (error.message);
    return res.status (500).send ('Server Error!');
  }
});

// @route GET /api/post/:user_id
// @desc get a single post
// @access private

router.get ('/:user_id', auth, async (req, res) => {
  try {
    const post = await Post.find ({_id: req.params.user_id});
    if (!post) {
      return res.status (404).json ({msg: 'Post not found!'});
    }
    res.json (post);
  } catch (error) {
    console.error (error.message);
    if (error.kind === 'ObjectId') {
      return res.status (404).json ({msg: 'Post not found!'});
    }
    return res.status (500).send ('Server Error!');
  }
});

// @route DELETE /api/post/:id
// @desc delete a post
// @access private

router.delete ('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById (req.params.id);

    if (!post) {
      return res.status (404).json ('Post not found!');
    }

    if (post.user.toString () !== req.user.id) {
      return res.status (401).json ({msg: 'User not Authorized'});
    }

    await Post.findOneAndDelete ({_id: req.params.id});
    return res.json ('Post Removed!');
  } catch (error) {
    console.error (error.message);
    if (error.kind === 'ObjectId') {
      return res.status (404).json ({msg: 'Post not found!'});
    }
    return res.status (500).send ('Server Error!');
  }
});

module.exports = router;
