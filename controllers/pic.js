const express = require("express")
const router = express.Router()
const { pic_upload ,getPic ,deletePic} = require("../models/pic")
const mongoose = require("mongoose")
const { connPic } = require("../db/db")
const { checkAuthenticated } = require("../models/user")
//router.post("/upload", pic_upload.single("file"), function (req, res) {

router.post("/upload", pic_upload.fields([{ name: 'file', maxCount: 1 }, { name: 'mmm', maxCount: 1 }]), function (req, res) {

    //console.log(req.body)
    res.send("uploaded")
})

router.get("/get/:id",checkAuthenticated,getPic)

router.delete("/delete/:id",checkAuthenticated,deletePic)




module.exports = router