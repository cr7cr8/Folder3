const { connPic,wrapAndMerge } = require("../db/db")
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose")

//app.post("/upload", mongoDB_upload.single("file"), function (req, res) {
const pic_storage = new GridFsStorage({

    db: connPic,
    client: connPic.client,

    file: (req, file) => {

        console.log("------- mongoDB_storage start-------");
        return new Promise((resolve, reject) => {
            const fileInfo = {
           
                filename: file.originalname.split("-")[0],
                bucketName: 'pic_uploads',//match the collection name
                metadata: file.originalname.split("-")[1],
                aliases: ["aaa", "bbb", "ccc"],
            };


            resolve(fileInfo);

        })
        // cannot use then, otherwise file will not be uploaded into pic_file collection, file name will not be correct

    }
});
const pic_upload = multer({ storage: pic_storage });



function getPic(req, res) {
   // console.log(req.params.id)
    var gfs = new mongoose.mongo.GridFSBucket(connPic.db, {
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
function deletePic(req,res){
    var gfs = new mongoose.mongo.GridFSBucket(connPic.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: "pic_uploads"
    });

    gfs.find({ metadata: String(req.params.id) }, { limit: 1 }).forEach(pic => {

        gfs.delete(mongoose.Types.ObjectId(pic._id),function(err){

            if(err){res.send(err)}
            else{
                res.send(pic._id)
            }
        
        })
    })
}




module.exports = { pic_upload,  ...wrapAndMerge(getPic,deletePic) }