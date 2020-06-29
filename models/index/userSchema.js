var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")
var postSchema = require("../posts/postSchema")
var Post = mongoose.model("Post",postSchema)
var notificationSchema = require("./notificationSchema")
var Notification = mongoose.model("Notification",notificationSchema)
var userSchema = new mongoose.Schema({
    email : String,
    username : String,
    password : String,
    friends : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    coverPic : String , 
    profilePic : String,
    sentFriendRequest : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    receivedFriendRequest: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    sentMessages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    }],
    receivedMessages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    }],
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }],
    notifications : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Notification"
    }],
    numberPost : Number,
    numberFriend : Number,
    numberSentRequest : Number,
    numberReceivedRequest : Number  ,
    joinedOn : String,
    firstName : String,
    lastName : String,
    address : String,
    city : String,
    country : String,
    job : String,
    workStation : String,
    about : String,
    timeline : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }],
    newNotificationCount : Number,
    newMsgCount : Number,
    newRequestCount : Number,
    messageList : [{
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        lastMessage : String,
        date : String,
        time : String,
        timeOfPosting : Date
    }]
})

userSchema.plugin(passportLocalMongoose)
module.exports = userSchema