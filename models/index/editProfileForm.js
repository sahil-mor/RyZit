var mongoose = require("mongoose")
var userSchema = require("./userSchema")
var User = mongoose.model("User",userSchema)

editProfileForm = (req,res)=>{
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
    .exec( (err,user) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/index")
        }else{
            res.render("index/editprofile",{ user : user, title : "Edit Profile" })
        }
    } )
}
module.exports = editProfileForm