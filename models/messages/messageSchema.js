var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
messageSchema = new mongoose.Schema({
    data : String,
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    date : String,
    time : String
})
module.exports = messageSchema