var mongoose = require("mongoose")
var notificationSchema = new mongoose.Schema({
    username : String,
    pic : String,
    title : String,
    time : Date,
    redirectingLink : String,
    date : String
})

module.exports = notificationSchema