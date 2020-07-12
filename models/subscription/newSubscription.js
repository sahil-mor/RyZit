var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var Subscription = require("./schema")

newSubscription = (req,res) => {
    Subscription.create({
        endpoint : req.body.endpoint,
        keys : {
            auth : req.body.keys.auth,
            p256dh : req.body.keys.p256dh
        },
        uid : req.user
    }, (err,newSubscription) => {
        if(err){
            res.status(500).json({ error : err })
        }else{
            User.findById(req.user.id,(err,user) => {
                if(err){
                    console.log(err)
                    res.status(500).json({ error : err })
                }else{
                    user.notificationSub = true;
                    user.save( (err,saved) => {
                        if(err){
                            console.log(err)
                            res.status(500).json({ error : err })
                        }else{
                            User.findByIdAndUpdate(req.user.id,saved,(err,updated) => {
                                if(err){
                                    console.log(err)
                                    res.status(500).json({ error : err })
                                }else{
                                    res.status(200).json({ message : "Data stored" })
                                }
                            } )
                        }
                    } )
                }
            })
        }
    } )
}

module.exports = newSubscription