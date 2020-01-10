const { connDB1, wrapAndMerge, connPic } = require("../db/db")
const { deletePic } = require("./pic")
const { messageSchema } = require("../db/schema")
const Message = connDB1.model("message_model", messageSchema)
const path = require("path")
const express = require("express")

const mongoose = require("mongoose")
const viewFolderPath = path.join(__dirname, `../views/${path.parse(__filename).name}`)

let count = 0

function staticFile(req, res, next) {

    express.static(viewFolderPath)(req, res, next)
}



function listMessage(req, res) {

    return Message.find({ author: req.user._id }).sort("-createdAt").limit(10).exec()
        .then(docs => {
            res.render(path.join(viewFolderPath, "home.ejs"), { docs: docs, sess: JSON.stringify(req.session) })

        })
}

function createMessage(req, res) {

    return Message.create({
        item: decodeURIComponent(req.body.item),
        author: req.user._id,
        pic: req.body.pic,

    })
        .then(function (doc) {

            //console.log({ item: decodeURIComponent(req.body.item) }, req.user.name);
            // res.json({ item: decodeURIComponent(req.body.item) })
            res.json(doc)
        })

}

function deleteMessage(req, res) {

  

    Message.findById(req.params.id).exec().then(function (m) {
        if (m.pic) {

            Message.deleteOne({ _id: req.params.id }, function (err) {
                (err) ? res.send(err) :   deletePic(req,res)
            });

          
        }
        else {
            Message.deleteOne({ _id: req.params.id }, function (err) {
                (err) ? res.send(err) : res.send(req.params.id)
            });
        }

    })

    // return Message.deleteMessageById(req.params.id).then(function (m) {

    // var gfs = new mongoose.mongo.GridFSBucket(connPic.db, {
    //     chunkSizeBytes: 255 * 1024,
    //     bucketName: "pic_uploads"
    // });
    // console.log(".....", req.params.id)
    // gfs.find({ metadata: String(req.params.id) }, { limit: 1 }).forEach(pic => {
    //     console.log("------", pic)
    //       gfs.delete(mongoose.Types.ObjectId(pic._id), function (err) {
    //         console.log("hhhh")
    //         if (err) { console.log(err) }
    //     })
    // })

    //   res.send(m)
    //})
}

function getProfile(req, res) {

    if (req.user) {
        const forwarded = req.headers['x-forwarded-for']
        const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
        req.session.passport.user.ip = ip;

        res.render(viewFolderPath + "/profile", { Username: req.user.name, Session: req.session, Obj: req.user, Port: process.env.PORT || 80, count: count++ })
    }
    else {
        res.send(req.session)
    }
}





module.exports = { ...wrapAndMerge(staticFile, listMessage, createMessage, deleteMessage, getProfile) }

