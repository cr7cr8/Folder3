const { wrapAndMerge } = require("../db/db")


const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose")

const { Metadata } = require("../db/schema")



console.log(Metadata.db === mongoose.connections[2])

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



const pic_storage = new GridFsStorage({

    db: Metadata.db,
    client: Metadata.db.client,

    file: (req, file) => {

        console.log("------- mongoDB_storage start-------");
       // console.log(req.user)
        return new Promise((resolve, reject) => {


            const fileInfo = {

                filename: file.originalname.split("-")[0],
                bucketName: 'pic_uploads',//match the collection name

                metadata: String(file.originalname.split("-")[1]),


                // metadata: new Metadata({
                //     owner: mongoose.Types.ObjectId(req.user._id),
                //     message: mongoose.Types.ObjectId(file.originalname.split("-")[1]),
                // }),
                aliases: ["aaa", "bbb", "ccc"],
            };


            resolve(fileInfo);

        })
        // cannot use then, otherwise file will not be uploaded into pic_file collection, file name will not be correct

    }
});
const pic_upload = multer({ storage: pic_storage });

function uploadPic(req, res, next) {
     pic_upload.fields([{ name: 'file', maxCount: 1 }, { name: 'mmm', maxCount: 1 }])(req,res,next)  
 //     res.send("uploaded")
 //   next()
}

















function getPic(req, res) {
    // console.log(req.params.id)

    // console.log(",,,",req.user._id)


    var gfs = new mongoose.mongo.GridFSBucket(Metadata.db.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: "pic_uploads"
    });
    gfs.find({ metadata: String(req.params.id) }, { limit: 1 }).forEach(pic => {

        let gfsrs = gfs.openDownloadStream(pic._id);

        //   console.log(pic._id)
        gfsrs.on("data", function (data) {
            //  console.log(data);
            res.write(data);
        })
        gfsrs.on("close", function () {
            res.end();
            console.log(`------fetching ${pic.filename} Done !----`);
        })
    })
}

//deletePic("5e1741371e15491268c1f235")
function deletePic(req, res) {

    console.log("in deletePic ---")
    var gfs = new mongoose.mongo.GridFSBucket(connPic.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: "pic_uploads"
    });

    return gfs.find({ metadata: String(req.params.id) }, { limit: 1 }).forEach(pic => {

        gfs.delete(mongoose.Types.ObjectId(pic._id), function (err) {

            if (err) { console.log(err) }
            else {
                res.send(pic._id)
            }

        })
    })
}


module.exports = {  ...wrapAndMerge(getPic, deletePic,uploadPic) }