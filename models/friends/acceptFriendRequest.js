var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var notificationSchema = require("../index/notificationSchema")
var Notification = mongoose.model("Notification",notificationSchema)
var dateformat = require('dateformat')

function acceptRequest(req,res){
    User.findById(req.user.id,function(err,requestReceiver){
        if(err){
            console.log(err)
            console.log("hi i m here bro 1")
            req.flash("error","Friend Request Not Accepted Successfully")
            res.redirect('/index')
        }else{
            User.findById(req.params.senderOfRequestId,function(err,requestSender){
                if(err){
                    console.log(err)
                    console.log("hi i m here bro 2")
                    req.flash("error","Friend Request Not Accepted Successfully")
                    res.redirect('/index')
                }else{
                    indexOfReceivedRequest = requestReceiver['receivedFriendRequest'].indexOf(requestSender['id'])
                    indexOfSentRequest = requestSender['sentFriendRequest'].indexOf(requestReceiver['id'])
                    if(requestReceiver['friends'].indexOf(requestSender['id']) == -1){
                        delete requestReceiver['receivedFriendRequest'][indexOfReceivedRequest]
                        delete requestSender['sentFriendRequest'][indexOfSentRequest]
                        requestSender['numberSentRequest'] -= 1
                        requestReceiver['numberReceivedRequest'] -= 1
                        requestReceiver['friends'].push(requestSender)
                        requestSender['friends'].push(requestReceiver)
                        requestSender['numberFriend'] += 1
                        requestReceiver['numberFriend'] += 1
                        requestReceiver.newNotificationCount += 1
                        requestSender.newNotificationCount += 1
                        now = new Date();
                        Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                        var Times = dateformat(now, 'h:MM TT')
                        Notification.create({
                            username : requestSender.username,
                            pic : requestSender.profilePic,
                            title : "You and " + requestSender.username + " are friends now.",
                            time : Dates,
                            redirectingLink : "/view-" + requestSender.id,
                            date : Times
                        }, (err,newNotification) => {
                            if(err){
                                console.log(err)
                                console.log("hi i m here bro 3")
                                req.flash("error","Data Not Updated Successfully!!!")
                                res.redirect('/index')
                            }else{
                                Notification.create({
                                    username : requestReceiver.username,
                                    pic : requestReceiver.profilePic,
                                    title : "You and " + requestReceiver.username + " are friends now.",
                                    time : Dates,
                                    redirectingLink : "/view-" + requestReceiver.id,
                                    date : Times
                                }, (err,newNotification1) => {
                                    if(err){
                                        console.log(err)
                                        console.log("hi i m here bro 4")
                                        req.flash("error","Data Not Updated Successfully!!!")
                                        res.redirect('/index')
                                    }else{
                                        requestReceiver['notifications'].unshift(newNotification)
                                        requestSender['notifications'].unshift(newNotification1)
                                        requestSender.save(function(err,savedRequestSender){
                                            if(err){
                                                console.log(err)
                                                console.log("hi i m here bro 5")
                                                req.flash("error","Data Not Updated Successfully!!!")
                                                res.redirect('/index')
                                            }else{
                                                requestReceiver.save(function(err,savedRequestReceiver){
                                                    if(err){
                                                        console.log(err)
                                                        console.log("hi i m here bro 6")
                                                        req.flash("error","Data Not Updated Successfully!!!")
                                                        res.redirect('/index')
                                                    }else{
                                                        User.findByIdAndUpdate(requestSender['id'],savedRequestSender,function(err,updatedRequestSender){
                                                            if(err){
                                                                console.log(err)
                                                                console.log("hi i m here bro 7")
                                                                req.flash("error","Data Not Updated Successfully!!!")
                                                                res.redirect('/index')
                                                            }else{
                                                                User.findByIdAndUpdate(requestReceiver['id'],savedRequestReceiver,function(err,updatedRequestReceiver){
                                                                    if(err){
                                                                        console.log(err)
                                                                        console.log("hi i m here bro 8")
                                                                        req.flash("error","Data Not Updated Successfully!!!")
                                                                        res.redirect('/index')
                                                                    }else{
                                                                        req.flash("success","You Are Now Friends With " + updatedRequestSender['username'] + "!!!")
                                                                        res.redirect('/view-' + updatedRequestSender.id)
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                } )
                            }
                        } )
                    }
                    else{
                        res.redirect('/index')
                    }
                }
            })
        }
    })
}
module.exports = acceptRequest