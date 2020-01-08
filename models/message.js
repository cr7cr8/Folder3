const { connDB1, wrapAndMerge } = require("../db/db")
const { messageSchema } = require("../db/schema")
const Message = connDB1.model("message_model", messageSchema)
const path = require("path")
const express = require("express")


const viewFolderPath = path.join(__dirname, `../views/${path.parse(__filename).name}`)

let count = 0

function staticFile(req, res, next) {

    express.static(viewFolderPath)(req, res, next)
}



function listMessage(req, res) {

    return Message.find({ author: req.user.name }).sort("-createdAt").limit(100).exec()
        .then(docs => {
          
            res.render(path.join(viewFolderPath, "home.ejs"), { docs: docs, sess: JSON.stringify(req.session) })
        })
  

}

function createMessage(req, res) {

    return Message.create({ item: decodeURIComponent(req.body.item), author: req.user.name })
        .then(function (doc) {

            console.log({ item: decodeURIComponent(req.body.item) }, req.user.name);
            res.json({ item: decodeURIComponent(req.body.item) })

        })
     
}

function deleteMessage(req, res) {

    //Note: req.params.item is auto decoded, no need to   decordeURIComponent(req.params.item )
    // Message.find({ item: req.params.item, author: req.user.name }).deleteMany(function (err) {
    //     res.send(req.params.item)
    // })

    return Message.deleteMessage({ item: req.params.item, author: req.user.name }).then(function (m) {

        res.send(m)
    })

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

