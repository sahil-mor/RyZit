var mongoose = require("mongoose")

var subscriptionSchema = {
    endpoint : String,
    keys : {
        p256dh : String,
        auth : String
    },
    uid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
}

var Subscription = mongoose.model("Subscription",subscriptionSchema)

module.exports = Subscription