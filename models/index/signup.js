var mongoose = require("mongoose")
var userSchema = require("./userSchema")
var passport = require("passport")
User = mongoose.model("User",userSchema)
var dateformat = require('dateformat')
function Signup(req,res){
    if(req.body.confirmPassword !== req.body.password ){
        req.flash("error","PASSWORD ARE NOT THE SAME")
        res.redirect("/signup")
    }else{
        newUser = {
            username : req.body.username, mobileNumber : req.body.mobile,password : req.body.password,coverPic : ""
        }
        User.findOne({ mobileNumber : newUser.mobileNumber },function(err,foundMobileNumber){
            if(err){
                console.log(err)
                req.flash("error","UNEXPECTED ERROR OCCUR, PLEASE TRY AGAIN")
                res.redirect("/signup")
            }else{
                if(foundMobileNumber){
                    req.flash("error","MOBILE NUMBER ALREADY TAKEN")
                    res.redirect("/signup")
                }else{
                    User.findOne({username : newUser.username},function(err,foundUsername){
                        if(err){
                            console.log(err)
                            req.flash("error","UNEXPECTED ERROR OCCUR, PLEASE TRY AGAIN")
                            res.redirect("/signup")
                        }else{
                            if(foundUsername){
                                req.flash("error","USERNAME ALREADY TAKEN")
                                res.redirect("/signup")
                            }else{
                                now = new Date();
                                Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                                User.register({ username : req.body.username,mobileNumber : req.body.mobile,numberPost : 0,
                                    numberFriend : 0,notifications : [],joinedOn : Dates,numberSentRequest : 0, 
                                    numberReceivedRequest : 0,profilePic : "null",coverPic : "null",
                                    firstName : "",lastName : "",address : "",city : "",country : "",
                                    newNotificationCount : 0,newMsgCount : 0,newRequestCount : 0,messageList : [],
                                    job : "",workStation : "",about : "",timeline : [] },req.body.password,function(err,newUser){
                                    if(err){
                                        console.log(err)
                                        req.flash("error","SOME ERROR OCCUR,TRY AGAIN")
                                        res.redirect("/signup")
                                    }else{
                                        passport.authenticate("local")(req,res,function(){
                                            req.flash("success","WELCOME ," + newUser['username'])
                                            res.redirect("/index")
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    }
}
module.exports = Signup