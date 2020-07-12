var mongoose = require("mongoose")
var postSchema = require("./postSchema")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var Post = mongoose.model("Post",postSchema)
var notificationSchema = require("../index/notificationSchema")
var Notification = mongoose.model("Notification",notificationSchema)
var dateformat = require('dateformat')

var webpush = require("web-push")
var Subscription = require("../subscription/schema")

function addLike(req,res){
    var check = 0;
    wasLiked = false
    Post.findById(req.params.postId,function(err,post){
        if(err){
            console.log(err)
            req.flash("error","Cannot Find That Post Right Now!!!")
            res.redirect("/post-" + post.id )
        }else{
            User.findById(req.user.id,function(err,user){
                if(err){
                    console.log(err)
                    req.flash("error","Cannot Like This Post!!!")
                    res.redirect("/post-" + post.id )
                }else{
                    if(post['likedBy'].includes(user['id'])){
                        wasLiked = true
                        post['likes'] = post['likes'] - 1;
                        index = post['likedBy'].indexOf(user['id'])
                        delete post['likedBy'][index]
                    }else{
                        post['likes'] = post['likes'] + 1;
                        post['likedBy'].unshift(user)
                        User.findById(post.owner, (err,postOwner) => {
                            if(err){
                                console.log(err)
                                req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                res.redirect("/post-" + post.id )
                            }else{
                                now = new Date();
                                Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                                var Times = dateformat(now, 'h:MM TT')
                                Notification.create({
                                    username : user.username,
                                    pic : post.image,
                                    title : user.username + " liked your post.",
                                    time : Dates,
                                    redirectingLink : "/post-" + post.id,
                                    date : Times
                                },(err,newNotification) => {
                                    if(err){
                                        console.log(err)
                                        req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                        res.redirect("/post-" + post.id )
                                    }else{
                                        postOwner.notifications.unshift(newNotification)
                                        postOwner.newNotificationCount += 1
                                        postOwner.save( (err,savedOwner) => {
                                            if(err){
                                                console.log(err)
                                                req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                res.redirect("/post-" + post.id ) 
                                            }else{
                                                User.findByIdAndUpdate(postOwner.id,savedOwner,(err,updatedOwner)=>{
                                                    if(err){
                                                        console.log(err)
                                                        req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                        res.redirect("/post-" + post.id ) 
                                                    }else{}
                                                })
                                            }
                                        } )
                                    }
                                })
                            }
                        } )
                    }
                    post.save(function(err,savedPost){
                        if(err){
                            console.log(err)
                            req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                            res.redirect("/post-" + post.id )
                        }else{
                            Post.findByIdAndUpdate(post['id'],savedPost,function(err,updatedPost){
                                if(err){
                                    console.log(err)
                                    req.flash("error","Problem In Updating Data Of This Post, Try Again Later!!!")
                                    res.redirect("/post-" + post.id )
                                }else{
                                    if(wasLiked){
                                        req.flash("success","You Unliked This Post")
                                    }else{
                                        req.flash("success","You Liked This Post")
                                    }
                                    webpush.setVapidDetails('mailto:ryzit1@gmail.com','BODNo79y6EjFqHCpKPh-auheD4NH21jWIhaDZt7_uBt9LLg4ZVUJ-8rfMRg47VZWVviLA-pC_awr71lvnt705vs','clFCCVwBLp6rzCZo_LfdFcusSlLa-0CQ8-J77GJUD30')
                                    Subscription.find({}, (err,subscriptions) => {
                                        if(err){
                                            console.log(err)
                                            res.redirect("/index")
                                        }else{
                                            subscriptions.forEach( sub => {
                                                if( post.owner.toString().includes(sub.uid.toString()) ){
                                                    var pushConfig = {
                                                        endpoint : sub.endpoint,
                                                        keys : {
                                                            auth : sub.keys.auth,
                                                            p256dh : sub.keys.p256dh
                                                        }
                                                    };
                                                    console.log("sending notification")
                                                    webpush.sendNotification(pushConfig, JSON.stringify({
                                                        title : post.caption,
                                                        content : req.user.username + " liked your post." ,
                                                        image : post.image,
                                                        openUrl : 'https://ryzit.herokuapp.com/post-' + post.id 
                                                    }) )
                                                }
                                            })
                                            res.redirect("/post-" + post.id )
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

module.exports = addLike