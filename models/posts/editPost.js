var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var postSchema = require("./postSchema")
var User = mongoose.model("User",userSchema)
var Post = mongoose.model("Post",postSchema)
function editPost(req,res){
    User.findById(req.user.id,function(err,foundUser){
        if(err){
            console.log(err)
            req.flash("error","Cannot Edit This Post Right Now!!!")
            res.redirect("/post-" + req.params.postId)
        }else{
            Post.findById(req.params.postId,function(err,foundPost){
                if(err){
                    console.log(err)
                    req.flash("error","Cannot Edit This Post Right Now!!!")
                    res.redirect("/post-" + req.params.postId)
                }else{
                    foundPost.caption = req.body.caption
                    foundPost.edited = true
                    foundPost.save( (err,savedPost) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Cannot Edit This Post Right Now!!!")
                            res.redirect("/post-" + req.params.postId)
                        }else{
                            Post.findByIdAndUpdate(req.params.postId, savedPost, (err,updatedPost) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","Cannot Edit This Post Right Now!!!")
                                    res.redirect("/post-" + req.params.postId)
                                }else{
                                    req.flash("success","Post edited successfully!!!")
                                    res.redirect("/post-" + req.params.postId)
                                }
                            } )
                        }
                    } )
                }
            })
        }
    })
}
module.exports = editPost