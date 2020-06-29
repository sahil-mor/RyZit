var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var messageSchema = require("./messageSchema")
var Message = mongoose.model("Message",messageSchema)

allMsgs = (req,res) => {
    User.findById(req.user.id)
    .populate({
        path : "messageList",
        populate : {
            path : "user",
            model  : "User"
        }
    })
    .populate("notifications")
    .populate("receivedFriendRequest")
    .populate("sentFriendRequest")
    .exec( (err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occurred!!!")
            res.redirect("/index")
        }else{
            res.render("messages/allMessages",{ title: "Messages", user : user })
        }
    } )
}

module.exports = allMsgs