var express = require("express")
var router = express.Router();
var mongoose = require("mongoose")
var passport = require("passport") 

var otpSchema = require("../models/otp/otpSchema")
var OTP = mongoose.model("OTP", otpSchema)

var verifyOTP = require("../models/otp/verifyOtp") 

router.get("/otp-:email-:id", (req,res) => {
    res.render("index/otp",{ otpId : req.params.id, email : req.params.email , title : "Verify Email Address"  })
} )
router.post("/verifyEmail-:otpId",verifyOTP )

module.exports = router