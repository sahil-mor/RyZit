var mongoose = require("mongoose")

var subscriptionSchema = {
    endpoint : String,
    keys : {
        p256dh : String,
        auth : String
    }
}

var Subscription = mongoose.model("Subscription",subscriptionSchema)

module.exports = Subscription