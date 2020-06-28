var express = require("express")
var router = express.Router();
var middleware = require("../middleware")

var profilePictureForm = require("../models/posts/profilePicForm")
var profilePictureUpdate = require("../models/posts/profilePicUpdate")
var createPostForm = require("../models/posts/createPostForm")
var createPost = require("../models/posts/createPost")
var likePost = require("../models/posts/likePost")
var myPosts = require("../models/posts/myPosts")
var otherPosts = require("../models/posts/otherPost")
var viewPost = require("../models/posts/viewPost")
var editPost = require("../models/posts/editPost")
var deletePost = require("../models/posts/deletePost")
var addComment = require("../models/posts/addComment")
var deleteComment = require("../models/posts/deleteComment")
var replyComment = require("../models/posts/replyComment")
var likeComment = require("../models/posts/likeComment")

router.get("/profilePicture",middleware.isLoggedIn,profilePictureForm)
router.post("/profilePicture",middleware.isLoggedIn,profilePictureUpdate)

router.get("/createPost", middleware.isLoggedIn,createPostForm )
router.post("/createPost",middleware.isLoggedIn,createPost)
router.post("/editPost-:postId",middleware.isLoggedIn,editPost)
router.get("/deletePost-:postId",middleware.isLoggedIn,deletePost)

router.get("/likePost-:postId",middleware.isLoggedIn,likePost)
router.get("/myPosts",middleware.isLoggedIn,myPosts)
router.get("/postsOf-:otherId",middleware.isLoggedIn,otherPosts)
router.get("/post-:postId",middleware.isLoggedIn,viewPost)
router.get("/deleteComment-:commentId-of-:postId",middleware.isLoggedIn,deleteComment)
router.get("/likeComment-:commentId-of-:postId",middleware.isLoggedIn,likeComment)

router.post("/addComment-:postId",middleware.isLoggedIn,addComment)
router.post("/replyComment-:commentId-of-:postId",middleware.isLoggedIn,replyComment)

module.exports = router