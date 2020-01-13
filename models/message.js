const { wrapAndMerge } = require("../db/db")
const { Message } = require("../db/schema")

const path = require("path")
const express = require("express")


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
         return   res.render(path.join(viewFolderPath, "blank.ejs"), { doc: doc })
//return res.send(doc._id)
        })

}

function deleteMessage(req, res, next) {



    return Message.findById(req.params.id).exec().then(function (m) {
        Message.deleteOne({ _id: req.params.id }, function (err) {
            (err) ? res.send(err) : res.send(req.params.id)
        })
        // if (m.pic) {
        //     console.log("has pic")
        //     Message.deleteOne({ _id: req.params.id }, function (err) {
        //    //     (err) ? res.send(err) : deletePic(req, res)
        //         (err) ? res.send(err) : res.send(req.params.id)
        //         //    (err) ? res.send(err) : next(req, res) //cannot work due to promise
        //      //   return res.send(req.params.id)
        //     });
        // }
        // else {
        //     console.log("has no pic")
        //     Message.deleteOne({ _id: req.params.id }, function (err) {
        //         (err) ? res.send(err) : res.send(req.params.id)
        //     });
        // }

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





module.exports = { ...wrapAndMerge(staticFile, createMessage,listMessage, getProfile, deleteMessage),  }

