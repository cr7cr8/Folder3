const express = require("express")
const router = express.Router()
const methodOverride = require("method-override")
const flash = require("express-flash")
const { loginUserFunc, registerUserFunc,  checkNotAuthenticated ,logoutFunc} = require("../models/user")


router.use(flash())
router.use(methodOverride("_method"))


router.get("/login", checkNotAuthenticated)

router.post("/login", loginUserFunc)

router.get("/register", checkNotAuthenticated)

router.post("/register", registerUserFunc)


router.use("/logout",logoutFunc)




//router.delete("/logout",logoutFunc)


//router.use(require("../models/tempFileCreate")(__dirname, __filename))





module.exports = router