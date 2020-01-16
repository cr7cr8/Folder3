const { wrapAndMerge } = require("../db/db")


const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose")

const { Pic } = require("../db/schema")
const multerUpload = require("../models/multerUpload")


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


// const pic_storage = new GridFsStorage({

//     db: Metadata.db,
//     client: Metadata.db.client,

//     file: (req, file) => {

//         console.log("------- mongoDB_storage start-------");
//        //  console.log(Object.keys(file), file.encoding)
//         // console.log(req.user)
//         return new Promise((resolve, reject) => {
//             if (file.originalname.split("!")[1] === "undefined") {
//                 const fileInfo = {
//                     filename: file.originalname.split("!")[0],
//                     bucketName: 'bad_uploads',//match the collection name

//                     metadata: req.user,

//                     // metadata: new Metadata({
//                     //     owner: mongoose.Types.ObjectId(req.user._id),
//                     //     message: mongoose.Types.ObjectId(file.originalname.split("-")[1]),
//                     // }),
//                     aliases: ["aaa", "bbb", "ccc"],
//                 };
//                 resolve(fileInfo);
//             }
//             else {
//                 const fileInfo = {
//                     filename: file.originalname.split("!")[0],
//                     bucketName: 'pic_uploads',//match the collection name

//                     metadata: mongoose.Types.ObjectId(file.originalname.split("!")[1]),

//                     // metadata: new Metadata({
//                     //     owner: mongoose.Types.ObjectId(req.user._id),
//                     //     message: mongoose.Types.ObjectId(file.originalname.split("-")[1]),
//                     // }),
//                     aliases: ["aaa", "bbb", "ccc"],
//                 };
//                 resolve(fileInfo);
//             }


//         })
//         // cannot use then, otherwise file will not be uploaded into pic_file collection, file name will not be correct

//     }
// });
// const pic_upload = multer({ storage: pic_storage });

function uploadPic(req, res, next) {

    const pic = new Pic({
        message: mongoose.Types.ObjectId(req.params.messageid),
        owner: mongoose.Types.ObjectId(req.user._id)
    })
    const upload = multerUpload(pic)

    upload.fields([{ name: "metadata", maxCount: 1 }, { name: 'file', maxCount: 1 }, { name: 'mmm', maxCount: 1 }])(req, res, next)
    
    
    //return    res.send(req.body)
    //   next()
}

function uploadPic2(req, res, next) {
    console.log(",,,,,,,", req.body.metadata)
    res.send(`<br><img src=/p/get/${req.params.messageid}>`)

}



function getPic(req, res) {
    // console.log(req.params.id)

    // console.log(",,,",req.user._id)

    var gfs = new mongoose.mongo.GridFSBucket(Pic.db.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: "pic_uploads"
    });
    gfs.find({ 'metadata.message': mongoose.Types.ObjectId(req.params.id) }, { limit: 1 }).forEach(pic => {

        let gfsrs = gfs.openDownloadStream(pic._id);

        //   console.log(pic._id)
        gfsrs.on("data", function (data) {
            //  console.log(data);
            res.write(data);
        })
        gfsrs.on("close", function () {
            res.end();
            //     console.log(`------fetching ${pic.filename} Done !----`);
        })
    })
}

//deletePic("5e1741371e15491268c1f235")
function deletePic(req, res) {

    console.log("in deletePic ---")
    var gfs = new mongoose.mongo.GridFSBucket(Pic.db.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: "pic_uploads"
    });

    return gfs.find({ 'metadata.message': mongoose.Types.ObjectId(req.params.id) }, { limit: 1 }).forEach(pic => {

        if (!pic) { res.send("pic not in database") }
        gfs.delete(mongoose.Types.ObjectId(pic._id), function (err) {

            if (err) { console.log(err) }
            else {
                res.send(pic._id)
            }

        })
    })
}


module.exports = { ...wrapAndMerge(getPic, deletePic, uploadPic, uploadPic2) }