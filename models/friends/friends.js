var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
function friends(req,res){
    User.findById(req.user.id)
    .populate("friends")
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
            res.send(err)
        }else{
            data = user['friends']
            res.render("friends/friends",{data : data, user : user, title : "Friends" })
        }
    })
}
module.exports = friends