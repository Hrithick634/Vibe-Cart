const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    if (!process.env.JWT_KEY) {
        throw new Error("Missing JWT_KEY in environment variables");
    }

    return jwt.sign(
        { email: user.email, id: user._id }, 
        process.env.JWT_KEY, 
        { expiresIn: "7d" } 
    );
};

module.exports = { generateToken };


