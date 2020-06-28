var express = require("express")
var router = express.Router();

var middleware = require("../middleware")

var messageRender = require("../models/messages/renderMessagePage")
var sendMessage = require("../models/messages/sendMessage")

router.get("/messages-:messageReceiver",middleware.isLoggedIn,messageRender);
router.post("/sendMessage-:messageReceiver",middleware.isLoggedIn,sendMessage)


module.exports = router