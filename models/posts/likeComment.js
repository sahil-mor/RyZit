var mongoose = require("mongoose")
var commentSchema = require("./commentSchema")
var Comment = mongoose.model("Comment",commentSchema)
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var postSchema = require("./postSchema")
var Post = mongoose.model("Post",postSchema)
var notificationSchema = require("../index/notificationSchema")
var Notification = mongoose.model("Notification",notificationSchema)
var dateformat = require("dateformat")

function likeComment(req,res){
    var isLiked = false
    Comment.findById(req.params.commentId,function(err,comment){
        if(err){
            console.log(err)
            req.flash("error","Cannot Like Comment Right Now")
            res.redirect("/post-" + req.params.postId)
        }else{
            if(comment['likedBy'].includes(req.user['id'])){
                isLiked = true
                comment['likes'] = comment['likes'] - 1
                index = comment['likedBy'].indexOf(req.user['id'])  
                delete comment['likedBy'][index]              
            }else{
                comment['likes'] = comment['likes'] + 1
                comment['likedBy'].push(req.user)
            }
            comment.save(function(err,savedComment){
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("/post-" + req.params.postId)
                }else{
                    Comment.findByIdAndUpdate(comment['id'],savedComment,function(err,updatedComment){
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occured!!!")
                            res.redirect("/post-" + req.params.postId)
                        }else{
                            if(isLiked){
                                req.flash("success","You Unliked Comment!!!")
                            }else{
                                req.flash("success","You liked Comment!!!")
                            }
                            Post.findById(req.params.postId, (err,post) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                    res.redirect("/post-" + req.params.postId)
                                }else{

                                    User.findById(updatedComment.commentBy, (err,commentOwner) => {
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                            res.redirect("/post-" + req.params.postId)
                                        }else{
                                            now = new Date();
                                            Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                                            var Times = dateformat(now, 'h:MM TT')
                                            Notification.create({
                                                username : req.user.username,
                                                pic : post.image,
                                                title : req.user.username + " liked your comment.",
                                                time : Dates,
                                                redirectingLink : "/post-" + req.params.postId,
                                                date : Times
                                            },(err,newNotification) => {
                                                if(err){
                                                    console.log(err)
                                                    req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                    res.redirect("/post-" + req.params.postId)
                                                }else{
                                                    commentOwner.notifications.unshift(newNotification)
                                                    commentOwner.newNotificationCount += 1
                                                    commentOwner.save( (err,savedOwner) => {
                                                        if(err){
                                                            console.log(err)
                                                            req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                            res.redirect("/post-" + req.params.postId) 
                                                        }else{
                                                            User.findByIdAndUpdate(commentOwner.id,savedOwner,(err,updatedOwner)=>{
                                                                if(err){
                                                                    console.log(err)
                                                                    req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                                    res.redirect("/post-" + req.params.postId) 
                                                                }else{
                                                                    res.redirect("/post-" + req.params.postId)
                                                                }
                                                            })
                                                        }
                                                    } )
                                                }
                                            })
                                        }
                                    } )
                                }
                            } )
                        }
                    })
                }
            }) 
        }
    })
}
module.exports = likeComment