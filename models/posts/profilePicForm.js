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
            req.flash("error","Cannot Upload Picture Right Now")
            console.log(err)
            res.redirect("/index")
        }else{
            res.render("posts/profilePic", { user : user, title : "Upload Profile Picture" })
        }
    })
}
module.exports = profilePicForm