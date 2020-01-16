const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose")


function multerUpload(model) {

    const storage = new GridFsStorage({

        db: model.db,
        client: model.db.client,
        file: (req, file) => {
            console.log("------- mongoDB_storage start-------");

            return new Promise((resolve, reject) => {

                resolve({
                    filename: file.originalname,
                    bucketName: model.schema.options.collection,     //match the collection name
                    metadata: model,
                });
            })
            // cannot use then, otherwise file will not be uploaded into pic_file collection, file name will not be correct

        }
    });
    return multer({ storage: storage });
}


function multerDownload(Model) {
    var gfs = new mongoose.mongo.GridFSBucket(Model.db.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: Model.modelName
    });



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











module.exports = multerUpload