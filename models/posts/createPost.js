var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var postSchema = require("./postSchema")
var User = mongoose.model("User",userSchema)
var Post = mongoose.model("Post",postSchema)
var path = require("path")
var multer = require("multer")
var dateformat = require("dateformat")
var storage = multer.diskStorage({
    destination : "uploads/posts",
    filename : function(req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

var uploads = multer({
    storage : storage,
}).single('image')

function savePost(req,res){
    User.findById(req.user.id).populate("friends").exec(function(err,user){
        if(err){
            console.log(err)
            req.flash("error","Cannot Create Post Right Now")
            res.redirect("/index")
        }else{
            uploads(req,res, (err) => {
                if(err){
                    console.log(err)
                    req.flash("error","Cannot Create Post Right Now")
                    res.redirect("/index")
                }else{
                    now = new Date();
                    Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                    var Times = dateformat(now, 'h:MM TT')
                    Post.create({
                        caption : req.body.caption,
                        image : req.file.path,
                        timeOfPosting : now,
                        date : Dates,
                        time : Times,
                        likes : 0,
                        comments : 0,
                        ownerPic : user.profilePic,
                        ownerName : user.username,
                        comment : [],
                        edited : false,owner : user
                    },function(err,createdPost){
                        if(err){
                            console.log(err)
                            req.flash("error","Cannot Create Post Right Now")
                            res.redirect("/index")
                        }else{
                            user['posts'].unshift(createdPost)
                            user.timeline.unshift(createdPost)
                            user['numberPost'] += 1
                            if(user.numberFriend != 0){
                                user.friends.forEach( eachId => {
                                    if(eachId != null){
                                        User.findById(eachId, (err,friend) => {
                                            if(err){
                                                console.log(err)
                                                req.flash("error","Cannot Create Post Right Now")
                                                res.redirect("/index")
                                            }else{
                                                friend.timeline.unshift(createdPost)
                                                friend.save( (err,savedFrnd) => {
                                                    if(err){
                                                        console.log(err)
                                                        req.flash("error","Cannot Create Post Right Now")
                                                        res.redirect("/index") 
                                                    }else{
                                                        User.findByIdAndUpdate(eachId.id, savedFrnd, (err,updatedFrnd) => {
                                                            if(err){
                                                                console.log(err)
                                                                req.flash("error","Cannot Create Post Right Now")
                                                                res.redirect("/index")    
                                                            }else{
                                                            }
                                                        } )
                                                    }
                                                } )
                                            }
                                        } )
                                    }
                                } )
                            }
                            user.save(function(err,savedUser){
                                if(err){
                                    console.log(err)
                                    req.flash("error","Cannot Create Post Right Now")
                                    res.redirect("/index")
                                }else{
                                    User.findByIdAndUpdate(req.user.id,savedUser,function(err,updatedUser){
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Cannot Create Post Right Now")
                                            res.redirect("/index")
                                        }else{
                                            req.flash("success","Post Created Successfully!!!")
                                            res.redirect("/index")
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            } )
        }
    })
}
module.exports = savePost