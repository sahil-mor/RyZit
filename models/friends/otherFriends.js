var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)

otherFriends = (req ,res) => {
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
            res.redirect('/index')
        }else{
            User.findById(req.params.otherId).populate("friends").exec((err,otherUser) => {
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect('/index')
                }else{
                    data = otherUser['friends']
                    res.render("friends/friends",{data : data, user : user, title : otherUser.username + " Friends" })
                }
            } )
        }
    } )
}

module.exports = otherFriends