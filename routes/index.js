var express = require("express")
var router = express.Router();
var mongoose = require("mongoose")
var passport = require("passport") 
var userSchema = require("../models/index/userSchema")
var User = mongoose.model("User",userSchema)

var signup = require("../models/index/signup")
var profile = require("../models/index/profile")
var indexRoute = require("../models/index/indexRoute")
var editProfileForm = require("../models/index/editProfileForm")
var notifications = require("../models/index/notifications")
var editProfile = require("../models/index/editProfile")

var middleware = require("../middleware")

router.get("/",function(req,res){
    res.render("index/home",{ title : "RyZit"})
})

router.get("/signup",(req,res)=>{
    res.render("index/signup",{title : "Signup - RyZit"})
})

router.post("/signup",signup)

router.post("/signin",passport.authenticate("local",{
    failureRedirect : "/wrongCredentials"
}),middleware.isLoggedIn,function(req,res){
    res.redirect("/index")
})

router.get("/wrongCredentials",function(req,res){
    req.flash("error","USERNAME OR PASSWORD IS WRONG")
    res.redirect("/")
})

router.get("/sessionExpired",function(req,res){
    req.flash("error","Sign in to continue!!!")
    res.redirect("/")
})

router.get("/index",middleware.isLoggedIn,indexRoute)
router.get("/profile",middleware.isLoggedIn,profile)
router.get("/editProfile",middleware.isLoggedIn,editProfileForm)
router.get("/notifications",middleware.isLoggedIn,notifications)
router.post("/editProfile",middleware.isLoggedIn,editProfile)

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","SUCCESSFULLY LOGGED YOU OUT")
    res.redirect("/")
})

module.exports = router