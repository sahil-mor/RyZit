var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var messageSchema = require("./messageSchema")
var Message = mongoose.model("Message",messageSchema)
var dateformat = require("dateformat")
function sendMessage(req,res){
    User.findById(req.user.id,function(err,messageSender){
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/messages-" + req.params.messageReceiver )
        }else{
            User.findById(req.params.messageReceiver,function(err,messageReceiver){
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("/messages-" + req.params.messageReceiver )
                }else{
                    now = new Date();
                    Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                    var Times = dateformat(now, 'h:MM TT')
                    newMessage ={
                        data : req.body.message,
                        sender : messageSender,
                        receiver : messageReceiver,
                        date : Dates,
                        time : Times,
                    }
                    Message.create(newMessage,function(err,createdMessage){
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occured!!!")
                            res.redirect("/messages-" + req.params.messageReceiver )
                        }else{
                            messageSender['sentMessages'].unshift(createdMessage)
                            messageSender.newMsgCount += 1;
                            messageReceiver['receivedMessages'].unshift(createdMessage)
                            messageReceiver.newMsgCount += 1;
                            var index = 0;var requiredIndex = 0;
                            if(messageSender.messageList.filter( eachOne => {
                                if(eachOne.user == messageReceiver.id){
                                    requiredIndex = index;
                                }
                                index += 1;
                                return eachOne.user == messageReceiver.id
                            } ).length != 0 ){
                                // means that already exists
                                var currentMsgList = messageSender.messageList
                                var requiredMsgList = currentMsgList[requiredIndex]
                                requiredMsgList.lastMessage = newMessage.data
                                requiredMsgList.date = Dates;
                                requiredMsgList.time = Times;
                                requiredMsgList.timeOfPosting = now;
                                // now shift it to index 0
                                var newList = currentMsgList.slice(0,requiredIndex)
                                newList = newList.concat(currentMsgList.slice(requiredIndex+1,currentMsgList.length))
                                currentMsgList = [requiredMsgList]
                                currentMsgList = currentMsgList.concat(newList)
                                messageSender.messageList = currentMsgList;
                            }else{
                                var newOne = {
                                    user : messageReceiver,
                                    lastMessage : newMessage.data,
                                    date : Dates,
                                    time : Times,
                                    timeOfPosting : now
                                }
                                messageSender.messageList.unshift(newOne)
                            }
                            index = 0;requiredIndex = 0;
                            if(messageReceiver.messageList.filter( eachOne => {
                                if(eachOne.user == messageSender.id){
                                    requiredIndex = index;
                                }
                                index += 1;
                                return eachOne.user == messageSender.id
                            } ).length != 0 ){
                                // means that already exists
                                var currentMsgList = messageReceiver.messageList
                                var requiredMsgList = currentMsgList[requiredIndex]
                                requiredMsgList.lastMessage = newMessage.data
                                requiredMsgList.date = Dates;
                                requiredMsgList.time = Times;
                                requiredMsgList.timeOfPosting = now;
                                // now shift it to index 0
                                var newList = currentMsgList.slice(0,requiredIndex)
                                newList = newList.concat(currentMsgList.slice(requiredIndex+1,currentMsgList.length))
                                currentMsgList = [requiredMsgList]
                                currentMsgList = currentMsgList.concat(newList)
                                messageReceiver.messageList = currentMsgList;
                            }else{
                                var newOne = {
                                    user : messageSender,
                                    lastMessage : newMessage.data,
                                    date : Dates,
                                    time : Times,
                                    timeOfPosting : now
                                }
                                messageReceiver.messageList.unshift(newOne)
                            }
                            messageSender.save(function(err,savedSender){
                                if(err){
                                    console.log(err)
                                    req.flash("error","Unexpected Error Occured!!!")
                                    res.redirect("/messages-" + req.params.messageReceiver )
                                }else{
                                    messageReceiver.save(function(err,savedReceiver){
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Unexpected Error Occured!!!")
                                            res.redirect("/messages-" + req.params.messageReceiver )
                                        }else{
                                            User.findByIdAndUpdate(messageSender['id'],savedSender,function(err,updatedSender){
                                                if(err){
                                                    console.log(err)
                                                    req.flash("error","Unexpected Error Occured!!!")
                                                    res.redirect("/messages-" + req.params.messageReceiver )
                                                }else{
                                                    User.findByIdAndUpdate(messageReceiver['id'],savedReceiver,function(err,updatedReceiver){
                                                        if(err){
                                                            console.log(err)
                                                            req.flash("error","Unexpected Error Occured!!!")
                                                            res.redirect("/messages-" + req.params.messageReceiver )
                                                        }else{
                                                            res.redirect("/messages-" + req.params.messageReceiver )}
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
    })
}
module.exports = sendMessage