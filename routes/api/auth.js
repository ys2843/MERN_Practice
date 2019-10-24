const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bscrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

router.get('/', [auth], async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    return res.json({
        user: user
    });
});

router.post('/', [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ "errors": errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    "errors": "User not found"
                })
            }

            const isMatch = await bscrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    "errors": "Password not valid"
                })
            }

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
                    res.json({ token });
                }
            );
        } catch (e) {
            console.error(e.message);
            res.status(500).send({ "msg": "Server error" });
        }
    });

module.exports = router;
``