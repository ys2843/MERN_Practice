const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', [
    check('email', 'email is required').isEmail(),
    check('name', 'name is required').not().isEmpty(),
    check('password', 'password is required').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array() });
    }

    const { email, name, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(500).json({
                "errors": "duplicate user"
            });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            password,
            avatar
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: 36000
            },
            (error, token) => {
                if (error) throw error;
                res.json({ token })
            }
        );
    } catch (e) {
        console.error(e.message);
        res.status(500).send({ "msg": "Server error" });
    }
});

module.exports = router;
