var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)

view = (req,res) => {
    User.findById(req.params.id).exec((err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Some Error Occured!!!")
            res.redirect('/index')
        }else{
            if(user.id == req.user.id){
                res.redirect("/profile")
            }else{
                User.findById(req.user.id)
                .populate("notifications")
                .populate("sentFriendRequest")
                .populate("receivedFriendRequest")
                .populate({
                    path : 'messageList',
                    populate : {
                      path : 'user',
                    }
                  })
                .exec( (err,loggedIn) => {
                    if(err){
                        console.log(err)
                        req.flash("error","Some Error Occured!!!")
                        res.redirect('/index')
                    }else{
                        res.render("friends/view",{ data : user, user : loggedIn, title : user.username })
                    }
                } )
            }
        }
    })
}

module.exports = view