const user = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const User = require("../models/user-model");
const Product = require("../models/product-model");

module.exports.registerUser = async (req, res) => {
    try {
    
        let { email, password, fullname } = req.body;

        let existingUser = await user.findOne({ email });
        if (existingUser) {
            req.flash("error", "You already have an account, please login.")
           return res.redirect("/");
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

      
        let newUser = await user.create({
            email,
            password: hashedPassword,  
            fullname,
        });

        
        let token = generateToken(newUser);
        res.cookie("token", token);
        res.status(201);
        res.redirect("/");

    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        let existingUser = await user.findOne({ email });
        if (!existingUser) {
            req.flash("error", "Email or password incorrect");
            return res.redirect("/");
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            req.flash("error", "Email or password incorrect");
            return res.redirect("/");
        }

        let token = generateToken(existingUser);
        res.cookie("token", token, { httpOnly: true, secure: true });

        res.redirect("/shop");
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).send(err.message);
        }
    }
};

module.exports.logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", { httpOnly: true, secure: true, maxAge: 0 });
        res.redirect("/");
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).send("Error logging out");
        }
    }
};

module.exports.userProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // Fetch the user and populate the cart with product data
        const user = await User.findById(req.user.id)
            .populate("cart")  // Populating cart field with product data
            .select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send the user data to the template
        res.status(200).render('profile', { user });
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Error fetching user data" });
    }
};
