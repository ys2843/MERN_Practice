const express = require('express');
const router = express.Router();
const { check, validateResult } = require('express-validator');

router.get('/', [
    check('email', 'email is required').isEmail(),
    check('name', 'name is required').not().isEmpty(),
    check('password', 'password is required').isLength({min: 6})
], (req, res) => {
    const errors = validateResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(400);
    }

    return res.send('success');
});

module.exports = router;
