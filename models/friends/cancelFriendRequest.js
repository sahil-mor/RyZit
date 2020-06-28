var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
function cancel(req,res){
    User.findById(req.user.id,function(err,senderOfRequest){
        if(err){
            console.log(err)
            req.flash("error","Friend Request Not Cancelled Successfully!!!")
            res.redirect('/index')
        }else{
            User.findById(req.params.receiverOfRequestId,function(err,receiverOfRequest){
                if(err){
                    console.log(err)
                    req.flash("error","Friend Request Not Cancelled Successfully!!!")
                    res.redirect('/index')
                }else{
                    indexOfIdInSender = senderOfRequest['sentFriendRequest'].indexOf(receiverOfRequest['id'])
                    delete senderOfRequest['sentFriendRequest'][indexOfIdInSender]
                    senderOfRequest['numberSentRequest'] -= 1
                    indexOfIdInReceiver = receiverOfRequest['receivedFriendRequest'].indexOf(senderOfRequest['id'])
                    delete receiverOfRequest['receivedFriendRequest'][indexOfIdInReceiver]
                    receiverOfRequest['numberReceivedRequest'] -= 1
                    senderOfRequest.save(function(err,savedSender){
                        if(err){
                            console.log(err)
                            req.flash("error","Friend Request Not Cancelled Successfully!!!")
                            res.redirect('/index')
                        }else{
                            receiverOfRequest.save(function(err,savedReceiver){
                                if(err){
                                    console.log(err)
                                    req.flash("error","Friend Request Not Cancelled Successfully!!!")
                                    res.redirect('/index')
                                }else{
                                    User.findByIdAndUpdate(senderOfRequest['id'] ,savedSender,function(err,updatedSender){
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Friend Request Not Cancelled Successfully!!!")
                                            res.redirect('/index')
                                        }else{
                                            User.findByIdAndUpdate(receiverOfRequest['id'],savedReceiver,function(err,updatedReceiver){
                                                if(err){
                                                    console.log(err)
                                                    req.flash("error","Friend Request Not Cancelled Successfully!!!")
                                                    res.redirect('/index')
                                                }else{
                                                    req.flash("success","Friend Request To " + updatedReceiver['username'] + " Cancelled Successfully!!!")
                                                    res.redirect('/view-' + updatedReceiver.id)
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
module.exports = cancel