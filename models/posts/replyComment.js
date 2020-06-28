var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var postSchema = require("./postSchema")
var User = mongoose.model("User",userSchema)
var Post = mongoose.model("Post",postSchema)
var commentSchema = require("./commentSchema")
var Comment = mongoose.model("Comment",commentSchema)
var notificationSchema = require("../index/notificationSchema")
var Notification = mongoose.model("Notification",notificationSchema)
var dateformat = require("dateformat")

function replyComment(req,res){
    console.log(req.params.commentId + " _ " + req.params.postId)
    Post.findById(req.params.postId,function(err,post){
        if(err){
            console.log(err)
            req.flash("error","Comment Cannot Be Added Right Now")
            res.redirect("/post-" + req.params.postId)
        }else{
            User.findById(req.user.id,function(err,user){
                if(err){
                    console.log(err)
                    req.flash("error","Comment Cannot Be Added Right Now")
                    res.redirect("/post-" + req.params.postId)
                }else{
                    now = new Date();
                    var Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                    Comment.create({
                        content : req.body.commentText, date : Dates, post : post, commentBy : user,
                        isEdited : false,likes : 0,likedBy : [],replies : [],
                        commentOwnerPic : user.profilePic,commentOwnerName : user.username,timeOfPosting : now,
                        commentOwnerId : req.user.id
                    },function(err,createdComment){
                        if(err){
                            console.log(err)
                            req.flash("error","Comment Cannot Be Added Right Now")
                            res.redirect("/post-" + req.params.postId)
                        }else{
                            Comment.findById( req.params.commentId , (err,comment) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","Comment Cannot Be Added Right Now")
                                    res.redirect("/post-" + req.params.postId)
                                }else{
                                    comment.replies.push(createdComment)
                                    comment.save( (err,savedComment) => {
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Comment Cannot Be Added Right Now")
                                            res.redirect("/post-" + req.params.postId)
                                        }else{
                                            Comment.findByIdAndUpdate(req.params.commentId,savedComment,(err,updatedComment)=>{
                                                if(err){
                                                    console.log(err)
                                                    req.flash("error","Comment Cannot Be Added Right Now")
                                                    res.redirect("/post-" + req.params.postId)
                                                }else{
                                                    User.findById(post.owner, (err,postOwner) => {
                                                        if(err){
                                                            console.log(err)
                                                            req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                            res.redirect("/post-" + req.params.postId)
                                                        }else{
                                                            now = new Date();
                                                            Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                                                            var Times = dateformat(now, 'h:MM TT')
                                                            Notification.create({
                                                                username : user.username,
                                                                pic : post.image,
                                                                title : user.username + " commented on your post.",
                                                                time : Dates,
                                                                redirectingLink : "/post-" + post.id,
                                                                date : Times
                                                            },(err,newNotification) => {
                                                                if(err){
                                                                    console.log(err)
                                                                    req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                                    res.redirect("/post-" + req.params.postId)
                                                                }else{
                                                                    postOwner.notifications.unshift(newNotification)
                                                                    postOwner.newNotificationCount += 1
                                                                    postOwner.save( (err,savedOwner) => {
                                                                        if(err){
                                                                            console.log(err)
                                                                            req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                                            res.redirect("/post-" + req.params.postId) 
                                                                        }else{
                                                                            User.findByIdAndUpdate(postOwner.id,savedOwner,(err,updatedOwner)=>{
                                                                                if(err){
                                                                                    console.log(err)
                                                                                    req.flash("error","Problem In Saving Data Of Post, Try Again Later!!!")
                                                                                    res.redirect("/post-" + req.params.postId) 
                                                                                }else{}
                                                                            })
                                                                        }
                                                                    } )
                                                                }
                                                            })
                                                        }
                                                    } )
                                                    post.comments += 1;
                                                    post.save(function(err,savedPost){
                                                        if(err){
                                                            console.log(err)
                                                            req.flash("error","Comment Cannot Be Added Right Now")
                                                            res.redirect("/post-" + req.params.postId)
                                                        }else{
                                                            Post.findByIdAndUpdate(post['id'],savedPost,function(err,updatedPost){
                                                                if(err){
                                                                    console.log(err)
                                                                    req.flash("error","Comment Cannot Be Added Right Now")
                                                                    res.redirect("/post-" + req.params.postId)
                                                                }else{
                                                                    req.flash("success","Comment Added Successfully")
                                                                    res.redirect("/post-" + req.params.postId)
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
                    })
                }
            })
        }
    })
}   
module.exports = replyComment