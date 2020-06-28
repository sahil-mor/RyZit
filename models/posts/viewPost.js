var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var postSchema = require("./postSchema")
var Post = mongoose.model("Post",postSchema)
var commentSchema = require("./commentSchema")
var Comment = mongoose.model("Comment",commentSchema)

myPosts = (req,res) => {
    User.findById(req.user.id)
    .populate("notifications")
    .populate("receivedFriendRequest")
    .populate("sentFriendRequest")
    .populate({
        path : 'messageList',
        populate : {
          path : 'user',
        }
      })
    .exec((err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/index")
        }else{
            Post.findById(req.params.postId)
            .populate("likedBy")
            .populate("comment")
            .populate("owner")
            .populate({
                path : 'comment',
                populate : {
                  path : 'likedBy',
                  path : 'replies',
                }
              })
            .exec((err,post)=>{
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("/index")
                }else{
                    if(post == null){
                      res.render("404error")
                    }else{
                      res.render("posts/singlePost",{ post : post, user : user , title : post.caption })
                    }
                }
            })
        }
    } )
}

module.exports = myPosts