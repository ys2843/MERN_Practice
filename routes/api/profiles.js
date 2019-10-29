const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

router.get('/me', auth, async (req, res) => {
    try {
        const profiles = await Profile.findOne({ user: req.user.id });
        if (!profiles) {
            return res.status(400).send("no user profile found");
        }
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("server error")
    }
});

router.post('/', [
    auth,
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    const newProfile = {};
    newProfile.user = req.user.id;
    if (company) newProfile.company = company;
    if (website) newProfile.website = website;
    if (location) newProfile.location = location;
    if (bio) newProfile.bio = bio;
    if (status) newProfile.status = status;
    if (githubusername) newProfile.githubusername = githubusername;
    if (skills) newProfile.skills = skills.split(',').map(skill => skill.trim());
    if (githubusername) newProfile.githubusername = githubusername;

    newProfile.social = {};
    if (youtube) newProfile.social.youtube = youtube;
    if (facebook) newProfile.social.facebook = facebook;
    if (twitter) newProfile.social.twitter = twitter;
    if (instagram) newProfile.social.youtube = instagram;
    if (linkedin) newProfile.social.youtube = linkedin;

    newProfile.social = {};
    if (youtube) newProfile.social.youtube = youtube;
    if (twitter) newProfile.social.twitter = twitter;
    if (facebook) newProfile.social.facebook = facebook;
    if (linkedin) newProfile.social.linkedin = linkedin;
    if (instagram) newProfile.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: newProfile },
                { new: true }
            );
            return res.json(profile);
        }
        
        profile = new Profile(newProfile);
        profile.save();
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.states(500).send("Server Error");
    }
});

module.exports = router;
