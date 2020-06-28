var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)

viewAllRq = (req,res) => {
    User.findById(req.user.id)
    .populate("sentFriendRequest")
    .populate("receivedFriendRequest")
    .populate("notifications")
    .populate({
                            path : 'messageList',
                            populate : {
                            path : 'user',
                            }
                        })
    .exec((err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Some Error Occured!!!")
            res.redirect('/index')
        }else{
            if(user.newRequestCount != 0){
                user.newRequestCount = 0;
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
                                res.render("friends/allRequests",{ user : updatedUser,title : "Friend Requests" })
                            }
                        } )
                    }
                } )
            }else{
                res.render("friends/allRequests",{ user : user,title : "Friend Requests" })
            }
        }
    })
}

module.exports = viewAllRq