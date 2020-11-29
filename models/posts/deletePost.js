var mongoose = require("mongoose")
var userSchema = require("../index/userSchema")
var postSchema = require("./postSchema")
var User = mongoose.model("User",userSchema)
var Post = mongoose.model("Post",postSchema)

const cloudinary = require('../cloudinary/index')

const deletePost = async (req,res) => {
    try {
        const foundUser = await User.findById(req.user.id )
        const foundPost = await Post.findById(req.params.postId)
        if(foundPost.owner != req.user.id){
            console.log(foundPost.owner + " : " + req.user.id)
            req.flash("error","Cannot Delete This Post Right Now!!!")
            res.redirect("/post-" + req.params.postId) 
        }else{
            indexOfPost = foundUser['posts'].indexOf(foundPost['id']);
            delete foundUser['posts'][indexOfPost]
            
            var cloudinary_id = ""
            var imageUrl = foundPost.image
            var startingIndex , lastIndex;
            if(imageUrl.includes("jpeg") ){
                startingIndex = imageUrl.length - 25
                lastIndex = imageUrl.length - 5
            }else{
                startingIndex = imageUrl.length - 24
                lastIndex = imageUrl.length - 4
            }

            cloudinary_id = imageUrl.slice(startingIndex,lastIndex)

            console.log(cloudinary_id)

            var deleted = await cloudinary.uploader.destroy(cloudinary_id);

            const post = await Post.findByIdAndRemove(req.params.postId )
            foundUser['numberPost'] -= 1
            const savedUser = await foundUser.save()
            const updatedUser = await User.findByIdAndUpdate(foundUser['id'],savedUser)
            req.flash("success","Post Deleted Successfully!!!")
            res.redirect("/index")
        }
    } catch (err) {
        console.log(err)
        req.flash("error","Cannot Delete This Post Right Now!!!")
        res.redirect("/post-" + req.params.postId)
    }
}
module.exports = deletePost