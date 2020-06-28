var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var messageSchema = require("./messageSchema")
var Message = mongoose.model("Message",messageSchema)

function renderPage(req,res){
    User.findById(req.user.id)
    .populate("friends")
    .populate("notifications")
    .populate("receivedFriendRequest")
    .populate("sentFriendRequest")
    .populate("sentMessages")
    .populate("receivedMessages")
    .populate({
        path : 'messageList',
        populate : {
          path : 'user',
        }
      })
    .exec( (err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/view-" + req.params.messageReceiver )
        }else{
            User.findById(req.params.messageReceiver, (err,messageReceiver) => {
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("/view-" + req.params.messageReceiver )
                }else{
                    var sentMessages = user.sentMessages.filter( msg => {
                        return msg.receiver == req.params.messageReceiver
                    } )
                    var receivedMessages = user.receivedMessages.filter( msg => {
                        return msg.sender == req.params.messageReceiver
                    } )
                    user.newMsgCount = 0;
                    user.save( (err,savedUser) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occured!!!")
                            res.redirect("/view-" + req.params.messageReceiver )
                        }else{
                            User.findByIdAndUpdate(req.user.id, savedUser, (err,updatedUser) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","Unexpected Error Occured!!!")
                                    res.redirect("/view-" + req.params.messageReceiver )
                                }else{
                                    res.render("messages/messages", { user : user, messageReceiver : messageReceiver, 
                                        sentMessages , receivedMessages , title : messageReceiver.username })
                                }
                            } )
                        }
                    } )
                }
            } )
        }
    } )
}
module.exports = renderPage