const express = require("express")
const router = express.Router()
const { checkAuthenticated } = require("../models/user")
const {staticFile,listMessage,createMessage,deleteMessage,getProfile} = require("../models/message")
const {deletePic} = require("../models/pic")
//const flash = require("express-flash")

//router.use(flash())
router.use(staticFile)

router.get("/profile", checkAuthenticated,getProfile)

router.get("/home", checkAuthenticated,listMessage)

router.post("/home", checkAuthenticated,createMessage)

//router.delete("/:id",checkAuthenticated,deleteMessage,deletePic);


router.delete("/:id",checkAuthenticated,deleteMessage);


//router.use(require("../models/tempFileCreate")(__dirname, __filename))

module.exports = router