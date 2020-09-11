var mongoose = require("mongoose")
var userSchema = require("./userSchema")
var User = mongoose.model("User",userSchema)

profile = (req,res) => {
    User.findById(req.user.id)
    .populate("receivedFriendRequest")
    .populate("sentFriendRequest")
    .populate("notifications")
    .populate({
        path : 'timeline',
        populate : {
          path : 'post',
          model : "Post",
        }
      })
    .populate({
        path : 'messageList',
        populate : {
          path : 'user',
        }
      })
    .exec(function(err,user) {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/")
        }else{
          res.render("index/index",{ user : user, title : "RyZit", data : user.timeline })
        }
    })
}
module.exports = profile