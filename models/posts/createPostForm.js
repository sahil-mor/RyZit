var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
function profilePicForm(req,res){
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
    .exec(function(err,user){
        if(err){
            req.flash("error","Cannot Upload Post Right Now")
            console.log(err)
            res.redirect("/index")
        }else{
            res.render("posts/createPost", { user : user, title : "Create Post" })
        }
    })
}
module.exports = profilePicForm