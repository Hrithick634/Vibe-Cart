const express = require("express");
const router = express.Router();
const {
    registerUser ,
    loginUser,
    logoutUser,
    userProfile } = require("../controllers/authController");
const isLoggedin = require("../middlewares/isLoggedin");

router.get("/users" , function(req , res){
    res.send("hy its' working")
})

router.post("/register" , registerUser);
router.post("/login" , loginUser);
router.get("/logout", logoutUser); 
router.get("/profile", isLoggedin, userProfile); 


module.exports = router;