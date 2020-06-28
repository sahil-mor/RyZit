var mongoose = require("mongoose")
var userSchema = require("./userSchema")
var User = mongoose.model("User",userSchema)

Notification = (req,res)=>{
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
            if(user.newNotificationCount != 0){
                user.newNotificationCount = 0;
                user.save( (err,savedUser) => {
                    if(err){
                        console.log(err)
                        req.flash("error","Unexpected Error Occured!!!")
                        res.redirect("/index")
                    }else{
                        User.findByIdAndUpdate(req.user.id, savedUser)
                        .populate("notifications")
                        .populate("receivedFriendRequest")
                        .populate("sentFriendRequest")
                        .populate({
                            path : 'messageList',
                            populate : {
                            path : 'user',
                            }
                        }).exec((err,updatedUser) => {
                            if(err){
                                console.log(err)
                                req.flash("error","Unexpected Error Occured!!!")
                                res.redirect("/index")
                            }else{
                                res.render("index/notifications",{ user : updatedUser, title : "Notifications" })
                            }
                        } )
                    }
                } )
            }else{
                res.render("index/notifications",{ user : user, title : "Notifications" })
            }
        }
    })
}
module.exports = Notification