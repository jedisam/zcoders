const express = require ('express');
const router = express.Router ();
const auth = require ('../../middleware/auth');
const Profile = require ('../../models/Profile');
const User = require ('../../models/User');
const {check, validationResult} = require ('express-validator');

// @route GET /api/profile/me
// @desc Get current users profile
// @access private
router.get ('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne ({
      user: req.user.id,
    }).populate ('user', ['name', 'avatar']);
    if (!profile) {
      return res.status (400).json ({msg: 'There is no profile for this user'});
    }
    res.json (profile);
  } catch (err) {
    console.error (err.message);
    res.status (500).send ('Server Error!');
  }
});

// @route POST /api/profile
// @desc create orr update a user profile
// @access private

router.post (
  '/',
  [
    auth,
    [
      check ('status', 'Status is required').not ().isEmpty (),
      check ('skills', 'Skill is required').not ().isEmpty (),
    ],
  ],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    // build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    profileFields.skills = skills.split (',').map (skill => skill.trim ());

    // build social objects
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = linkinstagramedin;

    try {
      let profile = await Profile.findOne ({user: req.user.id});
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate (
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
        );
        return res.json (profile);
      }
      // create profile
      profile = new Profile (profileFields);
      await profile.save ();
      res.json (profile);
    } catch (err) {
      console.error (err);
      res.status (500).json ({msg: 'Server Error!'});
    }
  }
);

// @route GET /api/profile/
// @desc GET all profiles
// @access public

router.get ('/', async (req, res) => {
  try {
    const profiles = await Profile.find ().populate ('user', [
      'name',
      'avatar',
    ]);
    res.json (profiles);
  } catch (err) {
    console.error (err);
    return res.status (500).json ('Server Error');
  }
});

// @route GET /api/profile/user/:user_id
// @desc GET profile by user id
// @access public

router.get ('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne ({
      user: req.params.user_id,
    }).populate ('user', ['name', 'avatar']);
    if (!profile) return res.status (400).json ({msg: 'Profile not found'});
    res.json (profile);
  } catch (err) {
    console.error (err);
    if (err.kind == 'ObjectId') {
      return res.status (400).json ({msg: 'Profile not found'});
    }
    res.status (500).send ('Server Error!');
  }
});

// @route DELETE /api/profile
// @desc Delete profile, user & posts
// @access private

router.delete ('/', auth, async (req, res) => {
  try {
    // remove users posts

    // remove profile
    await Profile.findOneAndRemove ({user: req.user.id});
    // remove user
    await User.findOneAndRemove ({_id: req.user.id});

    return res.json ({msg: 'User deleted!'});
  } catch (err) {
    console.error (err);
    return res.status (500).json ('Server Error');
  }
});

// @route PUT /api/profile/experience
// @desc Add profile exprerience
// @access private

router.put (
  '/experience',
  [
    auth,
    [
      check ('title', 'Title is Required!').not ().isEmpty (),
      check ('company', 'company is Required!').not ().isEmpty (),
      check ('from', 'From date is Required!').not ().isEmpty (),
    ],
  ],
  async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty ()) {
      return res.status (400).json ({errors: errors.array ()});
    }

    const {title, company, location, from, to, current, description} = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne ({user: req.user.id});
      profile.experience.unshift (newExp);
      await profile.save ();
      res.json (profile);
    } catch (err) {
      console.error (err);
      res.status (500).send ('Server Error!');
    }
  }
);

// @route DELETE /api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access private

router.delete ('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne ({user: req.user.id});
    const removeIndex = profile.experience
      .map (item => item.id)
      .indexOf (req.params.exp_id);
    profile.experience.splice (removeIndex, 1);
    await profile.save ();
    res.json (profile);
  } catch (err) {
    console.error (err);
    res.status (500).send ('Server Error!');
  }
});

module.exports = router;
