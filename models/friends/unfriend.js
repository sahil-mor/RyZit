var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
function unfriend(req,res){
    User.findById(req.user.id,function(err,user1){
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!")
            res.redirect('/index')
        }else{
            User.findById(req.params.otherId,function(err,otherId){
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!")
                    res.redirect('/index')
                }else{
                    index1 = user1['friends'].indexOf(otherId['id'])
                    index2 = otherId['friends'].indexOf(user1['id'])
                    delete user1['friends'][index1]
                    delete otherId['friends'][index2]
                    otherId['numberFriend'] = otherId['numberFriend'] - 1
                    user1['numberFriend'] = user1['numberFriend'] - 1
                    otherId.save(function(err,savedotherId){
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occured!!")
                            res.redirect('/index')
                        }else{
                            user1.save(function(err,saveduser1){
                                if(err){
                                    console.log(err)
                                    req.flash("error","Unexpected Error Occured!!")
                                    res.redirect('/index')
                                }else{
                                    User.findByIdAndUpdate(otherId['id'],savedotherId,function(err,updatedotherId){
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Unexpected Error Occured!!")
                                            res.redirect('/index')
                                        }else{
                                            User.findByIdAndUpdate(user1['id'],saveduser1,function(err,updateduser1){
                                                if(err){
                                                    console.log(err)
                                                    req.flash("error","Unexpected Error Occured!!")
                                                    res.redirect('/index')
                                                }else{
                                                    req.flash("success","You are no longer friend with " + updatedotherId.username + "!!!" )
                                                    res.redirect('/index')
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}
module.exports = unfriend