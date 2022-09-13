const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const UserAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: data._id });

        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        req.userID = user._id;
        next();
    } catch (error) {
        res.status(422).send({ statusCode: 422, message: "Not authorized to access this resource" });
        console.log(error);
    }

}

module.exports = UserAuth;