var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)

myPosts = (req,res) => {
    User.findById(req.user.id)
    .populate("posts")
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
            req.flash("success","Your Posts!!!")
            res.render("index/index",{ user : user , title : "My Posts", data : user.posts })
        }
    } )
}

module.exports = myPosts