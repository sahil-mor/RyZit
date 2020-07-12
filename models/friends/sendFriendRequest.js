var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var webpush = require("web-push")
var Subscription = require("../subscription/schema")
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
                                                        webpush.setVapidDetails('mailto:ryzit1@gmail.com','BODNo79y6EjFqHCpKPh-auheD4NH21jWIhaDZt7_uBt9LLg4ZVUJ-8rfMRg47VZWVviLA-pC_awr71lvnt705vs','clFCCVwBLp6rzCZo_LfdFcusSlLa-0CQ8-J77GJUD30')
                                                        Subscription.find({}, (err,subscriptions) => {
                                                            if(err){
                                                                console.log(err)
                                                                res.redirect("/index")
                                                            }else{
                                                                subscriptions.forEach( sub => {
                                                                    if( sub.uid == updatedAndSavedRequestedUser.id){
                                                                        var image = "https://i.ibb.co/XjFvrkQ/512x512.png"
                                                                        if(updatedLoggedInUser.profilePic != "null"){
                                                                            console.log("i m here")
                                                                            image = updatedLoggedInUser.profilePic
                                                                        }
                                                                        var pushConfig = {
                                                                            endpoint : sub.endpoint,
                                                                            keys : {
                                                                                auth : sub.keys.auth,
                                                                                p256dh : sub.keys.p256dh
                                                                            }
                                                                        };
                                                                        webpush.sendNotification(pushConfig, JSON.stringify({
                                                                            title : 'Friend Request',
                                                                            content : req.user.username + " sent you a friend request." ,
                                                                            image : image,
                                                                            openUrl : 'https://ryzit.herokuapp.com/view-' + updatedAndSavedRequestedUser.id
                                                                        }) )
                                                                    }
                                                                })
                                                                req.flash("success","Friend Request Sent Successfully")
                                                                res.redirect('/view-' + updatedAndSavedRequestedUser.id)
                                                            }
                                                        } )       
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