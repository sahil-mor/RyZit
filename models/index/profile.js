var mongoose = require("mongoose")
var userSchema = require("./userSchema")
var User = mongoose.model("User",userSchema)

profile = (req,res)=>{
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
    .exec(function(err,user) {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/index")
        }else{
            res.render("index/profile",{ user : user, title : "My Profile" })
        }
    })
}
module.exports = profile