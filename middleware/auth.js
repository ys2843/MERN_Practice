const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: "no token" });
    }

    try {
        const payload = jwt.verify(token, config.get('jwtSecret'));
        req.user = payload.user;
        next();
    } catch (e) {
        res.status(401).json({ msg: "jwt token not valid" });
    }
}