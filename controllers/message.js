const express = require("express")
const router = express.Router()
const path = require("path")

const { checkAuthenticated, checkNotAuthenticated } = require("../models/user")
const mongoose = require("mongoose");
const { connDB1 } = require("../db/db")

//console.log(connDB1)

const flash = require("express-flash")

let count = 0

router.use(flash())
var todo = connDB1.model("todos", new mongoose.Schema(

    {
        item: { type: String, minlength: 1 }, 
        author: { type: String, minlength: 1 }
    },
    { timestamps: true }
));





//var aaa = mongoose.model("aa",{}).collection


const viewFolderPath = path.join(__dirname, `../views/${path.parse(__filename).name}`)

router.use(express.static(viewFolderPath))


router.get("/profile", checkAuthenticated, function (req, res) {

    if (req.user) {
        const forwarded = req.headers['x-forwarded-for']
        const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
        req.session.passport.user.ip = ip;

        res.render(viewFolderPath + "/profile", { Username: req.user.name, Session: req.session, Obj: req.user, Port: process.env.PORT || 80, count: count++ })
    }
    else {
        res.send(req.session)
    }
})





router.get("/home", checkAuthenticated, function (req, res) {


  //  todo.find({}).sort()

    todo.find({author:req.user.name}).sort("-createdAt").limit(100).exec().then(docs => {

        res.render(path.join(viewFolderPath, "home.ejs"), { docs: docs, sess: JSON.stringify(req.session) })
    })

})




router.post("/home", checkAuthenticated, function (req, res) {
    //console.log(req.body.item);

    todo.create({ item: decodeURIComponent(req.body.item),author:req.user.name })
        .then(function (doc) {
            console.log({ item: decodeURIComponent(req.body.item) },req.user.name);
            res.json({ item: decodeURIComponent(req.body.item) })

        }).catch(function (err) {
            throw err;
        });


})


router.delete("/:item", function (req, res) {
    console.log(req.url);
    console.log((req.params.item));

    //Note: req.params.item is auto decoded, no need to   decordeURIComponent(req.params.item )
    todo.find({ item: req.params.item ,author:req.user.name}).deleteMany(function (err) {

        res.send(req.params.item)
    });
});

//router.use(require("../models/tempFileCreate")(__dirname, __filename))


module.exports = router