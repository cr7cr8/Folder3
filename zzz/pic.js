const { connPic } = require("../db/db")
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose")

//console.log(mongoose.connections[0].models)
connPic.once("open", function () {



    //  console.log(connDB1 === mongoose.connections[1])
    //  console.log(mongoose.connections[1].db.options)
})








//app.post("/upload", mongoDB_upload.single("file"), function (req, res) {
const pic_storage = new GridFsStorage({


    db: connPic,
    client: connPic.client,

    file: (req, file) => {

        console.log("------- mongoDB_storage start-------");
        //   console.log(file.originalname);
        //   console.log(file);
        return new Promise((resolve, reject) => {
            // crypto.randomBytes(16, (err, buf) => {
            //     if (err) { return reject(err); }
            console.log(file.originalname)

            //   console.log(req.headers['content-type'])
            //      const filename = path.basename(file.originalname).replace(path.extname(file.originalname), "") + "_" + buf.toString('hex').substr(0, 3) + path.extname(file.originalname);
            const fileInfo = {
             
                filename: file.originalname.split("-")[0],
                bucketName: 'pic_uploads',//match the collection name
                metadata: file.originalname.split("-")[1],
                aliases: ["aaa", "bbb", "ccc"],

            };
          

            resolve(fileInfo);
            //  });
        })
        // cannot use then, otherwise file will not be uploaded into pic_file collection, file name will not be correct
        // .then(function (fileInfo) {      
        //     console.log("-----", fileInfo._id)
        //     //  connDB1.fs
        // })
    }
});
const pic_upload = multer({ storage: pic_storage });

//const pic_upload = multer();



module.exports = { pic_upload }