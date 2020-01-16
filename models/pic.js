const { wrapAndMerge } = require("../db/db")

const mongoose = require("mongoose")

const { Pic } = require("../db/schema")



function uploadPic(req, res, next) {

    const pic = new Pic({obj:{
        linkage: mongoose.Types.ObjectId(req.params.messageid),
        message: mongoose.Types.ObjectId(req.params.messageid),
        owner: mongoose.Types.ObjectId(req.user._id)
    }})
   
    pic.upload(req, res, next);
   
}

function uploadPic2(req, res, next) {
   
    res.send(`<br><img src=/p/get/${req.params.messageid}>`)

}


function getPic(req, res) {
    Pic.download(req, res)
    
}


function deletePic(req, res) {
    Pic.delete(req,res)
    
}


module.exports = { ...wrapAndMerge(getPic, deletePic, uploadPic, uploadPic2) }





//console.log(Metadata.db === mongoose.connections[2])

// Metadata
//     .findOne({ 'metadata.owner': mongoose.Types.ObjectId("5dee692773cbbc1d981482e4") })
//     .select("-metadata._id")
//     .populate({ path: 'metadata.message', model: Message, select: "- -createdAt -updatedAt -__v" })
//     .populate({ path: 'metadata.owner', model: User, select: " -createdAt -updatedAt -__v" })
//     .populate({ path: 'message.author', model: User, select: "-_id -createdAt -updatedAt -__v" })
//     .exec().then(obj => {
//         console.log(obj.metadata)
//     })

//console.log(mongoose.connections[1])
