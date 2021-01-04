var mongoose = require("mongoose")
mailedToSchema = new mongoose.Schema({
    email : {
        type : String,
        default : ""
    },
    name : {
        type : String,
        default : ""
    },
    timeOfUploading : {
        type : Date,
        default : Date.now()
    },
})
module.exports = mailedToSchema