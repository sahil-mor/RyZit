var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
User = mongoose.model("User",userSchema)
var dateformat = require('dateformat')
var passport = require("passport")
var otpSchema = require("./otpSchema")
var OTP = mongoose.model("OTP",otpSchema)

verifyOtp = (req,res) => {
    OTP.findById(req.params.otpId, (err,foundOTP) => {
        if(err){
            console.log(err)
            req.flash("error","Cannot Verify Your Email Address Right Now!!!")
            res.redirect("/signup")
        }else{
            var now = new Date();
            var diff =(foundOTP.timeOfSending.getTime() - now.getTime()) / 1000;
            diff /= (60 * 60);
            diff < 0 ? diff = -diff : diff = diff;
            diff = Math.floor(diff);
            if(diff >= 1){
                OTP.findByIdAndDelete(req.params.otpId, (err,deletedOtp) => {
                    if(err){
                        console.log(err)
                        req.flash("error","Some Unexpected Error Occurred!!!")
                        res.redirect("/signup")
                    }else{
                        req.flash("error","This OTP has been expired!!!")
                        res.redirect("/signup")
                    }
                } )
            }else{
                if(foundOTP.otp != req.body.enteredOtp ){
                    req.flash("error","Wrong OTP Entered.. Try Again")
                    res.redirect("/otp-" + foundOTP.email + "-" + foundOTP.id )
                }else{
                    Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                    User.register({
                        username : foundOTP.username,email : foundOTP.email,numberPost : 0,
                        numberFriend : 0,notifications : [],joinedOn : Dates,numberSentRequest : 0, 
                        numberReceivedRequest : 0,profilePic : "null",coverPic : "null",
                        firstName : "",lastName : "",address : "",city : "",country : "",
                        newNotificationCount : 0,newMsgCount : 0,newRequestCount : 0,messageList : [],
                        job : "",workStation : "",about : "",timeline : []  }
                        ,foundOTP.password,function(err,newUser){
                            if(err){
                                console.log(err)
                                req.flash("error","SOME ERROR OCCUR,TRY AGAIN")
                                res.redirect("/otp-" + foundOTP.email + "-" + foundOTP.id )
                            }else{
                                OTP.findByIdAndDelete(req.params.otpId,(err,deletedOtp) => {
                                    if(err){
                                        console.log(err)
                                        req.flash("error","SOME ERROR OCCUR,TRY AGAIN")
                                        res.redirect("/index")
                                    }else{
                                        req.flash("success","Hello " + newUser.username + "... Login To Continue!!!" )
                                        res.redirect("/")
                                    }
                                })
                            }
                    })
                }
            }
        }
    } )
}

module.exports = verifyOtp