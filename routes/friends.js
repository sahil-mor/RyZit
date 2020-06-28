var express = require("express")
var router = express.Router();

var friends = require("../models/friends/friends")
var search = require("../models/friends/search")
var view = require("../models/friends/view")
var viewAllRequests = require("../models/friends/viewAllRequests")
var sendFR = require("../models/friends/sendFriendRequest")
var acceptFR = require("../models/friends/acceptFriendRequest")
var cancelFR = require("../models/friends/cancelFriendRequest")
var declineFR = require("../models/friends/declineFriendRequest")
var unfriend = require("../models/friends/unfriend")
var otherFriends = require("../models/friends/otherFriends")

var middleware = require("../middleware")

router.get("/search",middleware.isLoggedIn,search)
router.get("/friends",middleware.isLoggedIn,friends)
router.get("/view-:id",middleware.isLoggedIn,view)
router.get("/viewAllRequests",middleware.isLoggedIn,viewAllRequests)
router.get("/sendFriendRequest-:sendToId",middleware.isLoggedIn,sendFR)
router.get("/acceptFriendRequest-:senderOfRequestId",middleware.isLoggedIn,acceptFR)
router.get("/cancelFriendRequest-:receiverOfRequestId",middleware.isLoggedIn,cancelFR)
router.get("/declineFriendRequest-:requestSender",middleware.isLoggedIn,declineFR)
router.get("/unfriend-:otherId",middleware.isLoggedIn,unfriend)
router.get("/friendsOf-:otherId",middleware.isLoggedIn,otherFriends)


module.exports = router