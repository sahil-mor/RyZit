var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
function sendRequest(req,res){
    User.findById(req.user.id,function(err,foundUser){
        if(err){
            console.log(err)
            req.flash("error","Cannot Send Friend Request,Try Again")
            res.redirect('/index')
        }else{
            User.findById(req.params.sendToId,function(err,foundedUser){
                if(err){
                    console.log(err)
                    req.flash("error","Cannot Send Friend Request,Try Again")
                    res.redirect('/index')
                }else{
                    if(foundUser['sentFriendRequest'].indexOf(foundedUser['id']) == -1){
                        foundUser['numberSentRequest'] = foundUser['numberSentRequest'] + 1
                        foundedUser['numberReceivedRequest'] = foundedUser['numberReceivedRequest'] + 1
                        foundUser["sentFriendRequest"].push(foundedUser)
                        foundedUser['receivedFriendRequest'].push(foundUser)
                        foundedUser.newRequestCount += 1
                        foundUser.save(function(err,updatedLoggedInUser){
                            if(err){
                                console.log(err)
                                req.flash("error","Cannot Send Friend Request,Try Again")
                                res.redirect('/index')
                            }else{
                                foundedUser.save(function(err,updatedRequestedUser){
                                    if(err){
                                        console.log(err)
                                        req.flash("error","Cannot Send Friend Request,Try Again")
                                        res.redirect('/index')
                                    }else{
                                        User.findByIdAndUpdate(foundUser['id'],updatedLoggedInUser,function(err,updatedAndSavedLoggedInUser){
                                            if(err){
                                                console.log(err)
                                                req.flash("error","Unexpected Error Occured,Try Again")
                                                res.redirect('/index')
                                            }else{
                                                User.findByIdAndUpdate(foundedUser['id'],updatedRequestedUser,function(err,updatedAndSavedRequestedUser){
                                                    if(err){
                                                        console.log(err)
                                                        req.flash("error","Unexpected Error Occured,Try Again")
                                                        res.redirect('/index')
                                                    }else{
                                                        req.flash("success","Friend Request Sent Successfully")
                                                        res.redirect('/view-' + updatedAndSavedRequestedUser.id)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    else{
                        res.redirect('/index')
                    }
                }
            })
        }
    })
}
module.exports = sendRequest