const express = require("express")
const router = express.Router()
const { checkAuthenticated } = require("../models/user")
const {staticFile,listMessage,createMessage,deleteMessage,getProfile} = require("../models/message")
const flash = require("express-flash")

router.use(staticFile)


router.use(flash())
router.get("/profile", checkAuthenticated,getProfile)

router.get("/home", checkAuthenticated,listMessage)

router.post("/home", checkAuthenticated,createMessage)

router.delete("/:item",checkAuthenticated,deleteMessage);

//router.use(require("../models/tempFileCreate")(__dirname, __filename))


module.exports = router