var mongoose = require("mongoose")
var postSchema = new mongoose.Schema({
    image : String,
    caption : String,
    date : String,
    time : String,
    likes : Number,
    comments : Number,
    timeOfPosting : Date,
    likedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }] ,
    comment : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    ownerPic : String,
    ownerName : String,
    edited : Boolean
})


var Post = mongoose.model("Post",postSchema)
module.exports = postSchema