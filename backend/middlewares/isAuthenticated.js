const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = async (req, res, next) => {

    try {
        const token = req.cookies.token;

        console.log(token);

        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {

        console.error(error);
        return res.status(401).json({
            message: 'Invalid token',
            success: false
        });
    }
}


module.exports = isAuthenticated;