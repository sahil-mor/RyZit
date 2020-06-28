var mongoose = require("mongoose")
var userSchema = require("./userSchema")
var User = mongoose.model("User",userSchema)
var postSchema = require("../posts/postSchema")
var Post = mongoose.model("Post",postSchema)

editProfile = (req,res) => {
    User.findById(req.user.id)
    .populate("receivedFriendRequest")
    .populate("sentFriendRequest")
    .populate("notifications")
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
            if(user.username != req.body.username){
                user.posts.forEach( (eachPost) => {
                    if(eachPost != null){
                        Post.findById(eachPost, (err,foundPost) => {
                            if(err){
                                console.log(err)
                                req.flash("error","Cannot Create Post Right Now")
                                res.redirect("/index")
                            }else{
                                foundPost.save( (err,savedPost) => {
                                    if(err){
                                        console.log(err)
                                        req.flash("error","Cannot Create Post Right Now")
                                        res.redirect("/index")
                                    }else{
                                        Post.findByIdAndUpdate(eachPost,savedPost,(err,updatedPost)=>{
                                            if(err){
                                                console.log(err)
                                                req.flash("error","Cannot Create Post Right Now")
                                                res.redirect("/index")
                                            }else{
                                                
                                            }
                                        })
                                    }
                                } )
                            }
                        } )
                    }
                } )
            }
            user.username = req.body.username;
            user.mobileNumber = req.body.mobileNumber;
            if(req.body.firstName != ""){
                user.firstName = req.body.firstName;
            }
            if(req.body.lastName != ""){
                user.lastName = req.body.lastName;
            }
            if(req.body.address != ""){
                user.address = req.body.address;
            }
            if(req.body.city != ""){
                user.city = req.body.city;
            }
            if(req.body.country != ""){
                user.country = req.body.country;
            }
            if(req.body.job != ""){
                user.job = req.body.job;
            }
            if(req.body.workStation != ""){
                user.workStation = req.body.workStation;
            }
            if(req.body.about != ""){
                user.about = req.body.about;
            }
            user.save( (err,savedUser) => {
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("/index")
                }else{
                    User.findByIdAndUpdate(req.user.id, savedUser, (err,updatedUser) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occured!!!")
                            res.redirect("/index")
                        }else{
                            res.redirect("/profile")
                        }
                    } )
                }
            } )
        }
    })
}
module.exports = editProfile