var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var postSchema = require("./postSchema")
var User = mongoose.model("User",userSchema)
var Post = mongoose.model("Post",postSchema)
function deletePost(req,res){
    console.log("right route ")
    User.findById(req.user.id,function(err,foundUser){
        if(err){
            console.log(err)
            req.flash("error","Cannot Delete This Post Right Now!!!")
            res.redirect("/post-" + req.params.postId)
        }else{
            Post.findById(req.params.postId,function(err,foundPost){
                if(err){
                    console.log(err)
                    req.flash("error","Cannot Delete This Post Right Now!!!")
                    res.redirect("/post-" + req.params.postId)
                }else{
                    if(foundPost.owner != req.user.id){
                        console.log(foundPost.owner + " : " + req.user.id)
                        req.flash("error","Cannot Delete This Post Right Now!!!")
                        res.redirect("/post-" + req.params.postId) 
                    }else{
                        indexOfPost = foundUser['posts'].indexOf(foundPost['id']);
                        delete foundUser['posts'][indexOfPost]
                        Post.findByIdAndRemove(req.params.postId,function(err,post){
                            if(err){
                                console.log(err)
                                req.flash("error","Cannot Delete This Post Right Now!!!")
                                res.redirect("/post-" + req.params.postId)
                            }else{
                                foundUser['numberPost'] -= 1
                                foundUser.save(function(err,savedUser){
                                    if(err){
                                        console.log(err)
                                        req.flash("error","Cannot Delete This Post Right Now!!!")
                                        res.redirect("/post-" + req.params.postId)
                                    }else{
                                        User.findByIdAndUpdate(foundUser['id'],savedUser,function(err,updatedUser){
                                            if(err){
                                                console.log(err)
                                                req.flash("error","Cannot Delete This Post Right Now!!!")
                                                res.redirect("/post-" + req.params.postId)
                                            }else{
                                                req.flash("success","Post Deleted Successfully!!!")
                                                res.redirect("/index")
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    })
}
module.exports = deletePost