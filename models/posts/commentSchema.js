var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
commentSchema = new mongoose.Schema({
    content : String,
    date : String,
    isEdited : Boolean,
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    },
    commentBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    likes : Number,
    likedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    replies : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    commentOwnerPic : String,
    commentOwnerName : String,
    commentOwnerId : String,
    timeOfPosting : Date
})
module.exports = commentSchema