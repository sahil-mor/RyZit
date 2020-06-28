var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)

search = (req,res) => {
    User.find({},(err,users) => {
        if(err){
            console.log(err)
            req.flash("error","Some Error Occured!!!")
            res.redirect('/index')
        }else{
            var data = [];
            var search = req.query.search.toLowerCase();
            users.forEach(eachUser => {
                var username = eachUser.username.toLowerCase();
                if(username.includes(search)){
                    data.push(eachUser)
                }
            })
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
                    req.flash("error","Some Error Occured!!!")
                    res.redirect('/index')
                }else{
                    res.render("friends/search",{ data : data, user : user, title : req.query.name, search : req.query.search })
                } 
            } )
         }
    })
}

module.exports = search