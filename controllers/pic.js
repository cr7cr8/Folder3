const express = require("express")
const router = express.Router()
const { uploadPic,uploadPic2, getPic, deletePic } = require("../models/pic")
//const flash = require("express-flash")
const { checkAuthenticated } = require("../models/user")


//router.use(flash())
router.post("/upload/:messageid",checkAuthenticated  ,uploadPic,uploadPic2)

router.get("/get/:id", checkAuthenticated, getPic)

router.delete("/delete/:id", checkAuthenticated, deletePic)




module.exports = router