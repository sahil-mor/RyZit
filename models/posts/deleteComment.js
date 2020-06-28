var mongoose = require("mongoose")
var commentSchema = require("./commentSchema")
var Comment = mongoose.model("Comment",commentSchema)
var postSchema = require("./postSchema")
var Post = mongoose.model("Post",postSchema)

function deleteComment(req,res){
    Post.findById(req.params.postId, (err,post) => {
        if(err){
            console.log(err)
            req.flash("error","Cannot Edit This Comment Right Now!!!")
            res.redirect("/post-" + req.params.postId )
        }else{
            post.comments -= 1;
            post.save( (err,savedPost) => {
                if(err){
                    console.log(err)
                    req.flash("error","Cannot Edit This Comment Right Now!!!")
                    res.redirect("/post-" + req.params.postId )
                }else{
                    Post.findByIdAndUpdate(req.params.postId, savedPost, (err,updatedPost) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Cannot Edit This Comment Right Now!!!")
                            res.redirect("/post-" + req.params.postId )
                        }else{
                            Comment.findByIdAndRemove(req.params.commentId,function(err,comment){
                                if(err){
                                    console.log(err)
                                    req.flash("error","Cannot Edit This Comment Right Now!!!")
                                    res.redirect("/post-" + req.params.postId )
                                }else{
                                    req.flash("success","Comment Deleted Successfully!!!")
                                    res.redirect("/post-" + req.params.postId )
                                }
                            })
                        }
                    } )
                }
            } )
        }
    } )
}
module.exports = deleteComment