var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var postSchema = require("./postSchema")
var User = mongoose.model("User",userSchema)
var Post = mongoose.model("Post",postSchema)
var webpush = require("web-push")

const cloudinary = require('../cloudinary/index')
const uuid = require("uuid")

var path = require("path")
var multer = require("multer")
var dateformat = require("dateformat")
var storage = multer.diskStorage({
    // destination : "uploads/posts",
    
    filename : function(req,file,cb){
        cb(null,file.fieldname + "-" + uuid.v4() + path.extname(file.originalname));
    }
})

var uploads = multer({
    storage : storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 5 * 1024 * 1024
    }
}).single('image')

var Subscription = require("../subscription/schema")

const savePost = async (req,res) => {
    try{    
        const user = await User.findById(req.user.id)
        uploads(req,res,async (err) => {
            if(err){
                console.log(err)
                req.flash("error","Cannot Create Post Right Now")
                res.redirect("/index")
            }else{
                try {
                    const result = await cloudinary.uploader.upload(req.file.path);
                    const imageUrl = result.secure_url
                    now = new Date();
                    Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                    var Times = dateformat(now, 'h:MM TT')
                    const createdPost = await Post.create({
                        caption : req.body.caption,
                        image : imageUrl,
                        timeOfPosting : now,
                        date : Dates,
                        time : Times,
                        likes : 0,
                        comments : 0,
                        ownerPic : user.profilePic,
                        ownerName : user.username,
                        comment : [],
                        edited : false,owner : user
                    } )
                    user['posts'].unshift(createdPost)
                    user.timeline.unshift(createdPost)
                    user['numberPost'] += 1
                    var friends = []
                    if(user.numberFriend != 0){
                        user.friends.forEach( async eachId => {
                            try{
                                if(eachId != null){
                                    const friend = await User.findById(eachId)
                                    friends.push(friend)
                                    friend.timeline.unshift(createdPost)
                                    const savedFrnd = await friend.save()
                                    const updatedFrnd = await User.findByIdAndUpdate(eachId.id, savedFrnd)
                                }
                            }catch(err){
                                console.log(err)
                                req.flash("error","Cannot Create Post Right Now")
                                res.redirect("/index")
                            }
                        } )
                    }
                    const savedUser = await user.save()
                    const updatedUser = await User.findByIdAndUpdate(req.user.id,savedUser)
                    webpush.setVapidDetails('mailto:ryzit1@gmail.com',process.env.WEBPUSHKEY1,process.env.WEBPUSHKEY2)
                    const subscriptions = await Subscription.find({})
                    
                    subscriptions.forEach( sub => {
                        if( friends.includes(sub.uid) ){
                            var pushConfig = {
                                endpoint : sub.endpoint,
                                keys : {
                                    auth : sub.keys.auth,
                                    p256dh : sub.keys.p256dh
                                }
                            };
                            webpush.sendNotification(pushConfig, JSON.stringify({
                                title : 'New Post',
                                content : req.user.username + " added a new post." ,
                                image : imageUrl,
                                openUrl : 'https://ryzit.herokuapp.com/post-' + createdPost.id
                            }) )
                        }
                    })
                    req.flash("success","Post Created Successfully!!!")
                    res.redirect("/index")    
                } catch (err) {
                    console.log(err)
                    req.flash("error","Cannot Create Post Right Now")
                    res.redirect("/index")  
                }
            }
        } )
    }catch(err){
        console.log(err)
        req.flash("error","Cannot Create Post Right Now")
        res.redirect("/index")
    }  
}
module.exports = savePost