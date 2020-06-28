var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var postSchema = require("./postSchema")
var Post = mongoose.model("Post",postSchema)
var path = require("path")
var multer = require("multer")
var storage = multer.diskStorage({
    destination : "uploads/posts",
    filename : function(req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

var uploads = multer({
    storage : storage,
}).single('image')

function profilePicUpdate(req,res){
    User.findById(req.user.id,function(err,user){
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
                    user.profilePic = req.file.path
                    user.posts.forEach( (eachPost) => {
                        if(eachPost != null){
                            Post.findById(eachPost, (err,foundPost) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","Cannot Create Post Right Now")
                                    res.redirect("/index")
                                }else{
                                    foundPost.ownerPic = req.file.path
                                    foundPost.save( (err,savedPost) => {
                                        if(err){
                                            console.log(err)
                                            req.flash("error","Cannot Create Post Right Now")
                                            res.redirect("/index")
                                        }else{
                                            Post.findByIdAndUpdate(eachPost,savedPost,(err,updatedPost)=>{
                                                if(err){
                                                    console.log(err)
                                                    req.flash("error","Cannot Create Post Right Now")
                                                    res.redirect("/index")
                                                }else{
                                                    
                                                }
                                            })
                                        }
                                    } )
                                }
                            } )
                        }
                    } )
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
                                    req.flash("success","Profile Picture Uploaded Successfully!!!!")
                                    res.redirect("/index")
                                }
                            })
                        }
                    })
                }
            } )
        }
    })
}
module.exports = profilePicUpdate