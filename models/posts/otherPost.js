var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)

otherPosts = (req,res) => {
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
            User.findById(req.params.otherId).populate("posts").exec( (err,otherUser) => {
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("/index") 
                }else{
                    res.render("index/index",{ user : user , title : otherUser.username + " Posts", data : otherUser.posts })
                }
            } )
        }
    } )
}

module.exports = otherPosts