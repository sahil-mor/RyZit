var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var User = mongoose.model("User",userSchema)
var postSchema = require("./postSchema")
var Post = mongoose.model("Post",postSchema)
var path = require("path")
var multer = require("multer")

const cloudinary = require('../cloudinary/index')
const uuid = require("uuid")

var storage = multer.diskStorage({
    // destination : "uploads/posts",
    filename : function(req,file,cb){
        cb(null,file.fieldname + "-" + uuid.v4() + path.extname(file.originalname));
    }
})

var uploads = multer({
    storage : storage,
}).single('image')

async function profilePicUpdate(req,res){
    User.findById(req.user.id,function(err,user){
        if(err){
            console.log(err)
            req.flash("error","Cannot Create Post Right Now")
            res.redirect("/index")
        }else{
            uploads(req,res,async (err) => {
                if(err){
                    console.log(err)
                    req.flash("error","Cannot Create Post Right Now")
                    res.redirect("/index")
                }else{
                    const result = await cloudinary.uploader.upload(req.file.path);
                    const imageUrl = result.secure_url
                
                    user.profilePic = imageUrl
                    user.posts.forEach( (eachPost) => {
                        if(eachPost != null){
                            Post.findById(eachPost, (err,foundPost) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","Cannot Create Post Right Now")
                                    res.redirect("/index")
                                }else{
                                    foundPost.ownerPic = imageUrl
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