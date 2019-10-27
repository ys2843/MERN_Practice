const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Posts');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

router.post('/', [
    auth,
    [
        check('text').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        let user = await User.findById(userId).select('-password');
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: userId
        }
        const post = new Post(newPost);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).send("server error");
    }
});

module.exports = router;
