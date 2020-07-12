var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var messageSchema = require("./messageSchema")
var Message = mongoose.model("Message",messageSchema)
var dateformat = require("dateformat")
var webpush = require("web-push")
var Subscription = require("../subscription/schema")
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
                    var currentTime = new Date();
                    var currentOffset = currentTime.getTimezoneOffset();
                    var ISTOffset = 330;   // IST offset UTC +5:30
                    var today = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
                    Dates = dateformat(today, 'mmm d yyyy h:MM:ss TT');
                    var Times = dateformat(today, 'h:MM TT')
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
                                requiredMsgList.timeOfPosting = today;
                                // today shift it to index 0
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
                                    timeOfPosting : today
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
                                requiredMsgList.timeOfPosting = today;
                                // today shift it to index 0
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
                                    timeOfPosting : today
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
                                                            webpush.setVapidDetails('mailto:ryzit1@gmail.com','BODNo79y6EjFqHCpKPh-auheD4NH21jWIhaDZt7_uBt9LLg4ZVUJ-8rfMRg47VZWVviLA-pC_awr71lvnt705vs','clFCCVwBLp6rzCZo_LfdFcusSlLa-0CQ8-J77GJUD30')
                                                            Subscription.find({}, (err,subscriptions) => {
                                                                if(err){
                                                                    console.log(err)
                                                                    res.redirect("/index")
                                                                }else{
                                                                    subscriptions.forEach( sub => {
                                                                        if( req.params.messageReceiver == sub.uid  ){
                                                                            var pushConfig = {
                                                                                endpoint : sub.endpoint,
                                                                                keys : {
                                                                                    auth : sub.keys.auth,
                                                                                    p256dh : sub.keys.p256dh
                                                                                }
                                                                            };
                                                                            console.log("sending notification to " + sub.uid)
                                                                            webpush.sendNotification(pushConfig, JSON.stringify({
                                                                                title : messageSender.username,
                                                                                content :  createdMessage.data,
                                                                                openUrl : 'https://ryzit.herokuapp.com/messages-' + messageSender.id
                                                                            }) )
                                                                        }
                                                                    })
                                                                    res.redirect("/messages-" + req.params.messageReceiver )
                                                                }
                                                            } )  
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
    })
}
module.exports = sendMessage