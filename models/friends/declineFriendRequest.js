var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
function decline(req,res){
    User.findById(req.user.id,function(err,requestReceiver){
        if(err){
            console.log(err)
            req.flash("error","Friend Request Not Declined Successfully!!!")
            res.redirect('/index')
        }else{
            User.findById(req.params.requestSender,function(err,requestSender){
                if(err){
                    console.log(err)
                    req.flash("error","Friend Request Not Declined Successfully!!!")
                    res.redirect('/index')
                }else{
                    indexOfReceivedRequest = requestReceiver['receivedFriendRequest'].indexOf(requestSender['id'])
                    indexOfSenderRequest = requestSender['sentFriendRequest'].indexOf(requestReceiver['id'])
                    delete requestReceiver['receivedFriendRequest'][indexOfReceivedRequest]
                    delete requestSender['sentFriendRequest'][indexOfSenderRequest]
                    requestSender['numberSentRequest'] = requestSender['numberSentRequest'] - 1
                    requestReceiver['numberReceivedRequest'] = requestReceiver['numberReceivedRequest'] - 1
                    requestSender.save(function(err,savedRequestSender){
                        if(err){
                            console.log(err)
                            req.flash("error","Friend Request Not Declined Successfully!!!")
                            res.redirect('/index')
                        }else{
                            requestReceiver.save(function(err,savedRequestReceiver){
                                if(err){
                                    console.log(err)
                                    req.flash("error","Friend Request Not Declined Successfully!!!")
                                    res.redirect('/index')
                                }else{
                                    User.findByIdAndUpdate(requestSender['id'],savedRequestSender,function(err,updatedRequestSender){
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Friend Request Not Declined Successfully!!!")
                                            res.redirect('/index')
                                        }else{
                                            User.findByIdAndUpdate(requestReceiver['id'],savedRequestReceiver,function(err,updatedRequestReceiver){
                                                if(err){
                                                    console.log(err)
                                                    req.flash("error","Friend Request Not Declined Successfully!!!")
                                                    res.redirect('/index')
                                                }else{
                                                    req.flash("success","Friend Request Of " + updatedRequestSender['username']  +  " Declined Successfully!!!")
                                                    res.redirect('/view-' + updatedRequestSender.id)
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
module.exports = decline