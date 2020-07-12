var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var notificationSchema = require("../index/notificationSchema")
var Notification = mongoose.model("Notification",notificationSchema)
var webpush = require("web-push")
var Subscription = require("../subscription/schema")
var dateformat = require('dateformat')

function acceptRequest(req,res){
    User.findById(req.user.id,function(err,requestReceiver){
        if(err){
            console.log(err)
           
            req.flash("error","Friend Request Not Accepted Successfully")
            res.redirect('/index')
        }else{
            User.findById(req.params.senderOfRequestId,function(err,requestSender){
                if(err){
                    console.log(err)
                   
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
                                       
                                        req.flash("error","Data Not Updated Successfully!!!")
                                        res.redirect('/index')
                                    }else{
                                        requestReceiver['notifications'].unshift(newNotification)
                                        requestSender['notifications'].unshift(newNotification1)
                                        requestSender.save(function(err,savedRequestSender){
                                            if(err){
                                                console.log(err)
                                               
                                                req.flash("error","Data Not Updated Successfully!!!")
                                                res.redirect('/index')
                                            }else{
                                                requestReceiver.save(function(err,savedRequestReceiver){
                                                    if(err){
                                                        console.log(err)
                                                       
                                                        req.flash("error","Data Not Updated Successfully!!!")
                                                        res.redirect('/index')
                                                    }else{
                                                        User.findByIdAndUpdate(requestSender['id'],savedRequestSender,function(err,updatedRequestSender){
                                                            if(err){
                                                                console.log(err)
                                                               
                                                                req.flash("error","Data Not Updated Successfully!!!")
                                                                res.redirect('/index')
                                                            }else{
                                                                User.findByIdAndUpdate(requestReceiver['id'],savedRequestReceiver,function(err,updatedRequestReceiver){
                                                                    if(err){
                                                                        console.log(err)
                                                                       
                                                                        req.flash("error","Data Not Updated Successfully!!!")
                                                                        res.redirect('/index')
                                                                    }else{
                                                                        webpush.setVapidDetails('mailto:ryzit1@gmail.com','BODNo79y6EjFqHCpKPh-auheD4NH21jWIhaDZt7_uBt9LLg4ZVUJ-8rfMRg47VZWVviLA-pC_awr71lvnt705vs','clFCCVwBLp6rzCZo_LfdFcusSlLa-0CQ8-J77GJUD30')
                                                                        Subscription.find({}, (err,subscriptions) => {
                                                                            if(err){
                                                                                console.log(err)
                                                                                res.redirect("/index")
                                                                            }else{
                                                                                subscriptions.forEach( sub => {
                                                                                    if( sub.uid == requestSender.id){
                                                                                        var image = "https://i.ibb.co/XjFvrkQ/512x512.png"
                                                                                        if(requestReceiver.profilePic != "null"){
                                                                                            console.log("i m here")
                                                                                            image = requestReceiver.profilePic
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
                                                                                            content : req.user.username + " and you are friends now." ,
                                                                                            image : image,
                                                                                            openUrl : 'https://ryzit.herokuapp.com/view-' + updatedRequestSender.id
                                                                                        }) )
                                                                                    }
                                                                                })
                                                                                req.flash("success","You Are Now Friends With " + updatedRequestSender['username'] + "!!!")
                                                                                res.redirect('/view-' + updatedRequestSender.id)
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