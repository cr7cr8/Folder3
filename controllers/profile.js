const express = require("express")
const router = express.Router()
const { checkAuthenticated } = require("../models/user")
const path = require("path")
const { Profile } = require("../db/schema")
const mongoose=require("mongoose")
const viewFolderPath = path.join(__dirname, `../views/${path.parse(__filename).name}`)



let count = 0






// const storage = new GridFsStorage({

//     db: Profile.db,
//     client: Profile.db.client,

//     file: (req, file) => {

//         console.log("------- mongoDB_storage start-------");
//         // console.log(req.user)
//         return new Promise((resolve, reject) => {

//             const fileInfo = {
//                 filename: file.originalname,
//                 bucketName: 'profile_uploads',//match the collection name
//                 metadata: new Profile({
//                     profileName: mongoose.Types.ObjectId(req.user._id),
//                     //     buckgroudImg: mongoose.Types.ObjectId(file.originalname.split("-")[1]),
//                 }),

//             };
//             resolve(fileInfo);
//         })
//         // cannot use then, otherwise file will not be uploaded into pic_file collection, file name will not be correct

//     }
// });
// const upload = multer({ storage: storage });










router.get("/get", checkAuthenticated, function (req, res) {
   // console.log(Profile.name)
  //  console.log("====================",Profile.modelName,Profile.schema)
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

router.post("/post", function (req, res,next) {
    //console.log(p.)
    const p = new Profile({linkage:mongoose.Types.ObjectId(req.user._id)})
    
    const upload = multerUpload(p)
    upload.fields([{ name: 'file', maxCount: 1 }, { name: 'mmm', maxCount: 1 }])(req, res, next)
  
},function(req,res){
      res.send("uploaded")
})

router.get("/getimg", function (req, res) {
  
console.log(req.user._id)

    var gfs = new mongoose.mongo.GridFSBucket(Profile.db.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: "profile_uploads"
    });
 gfs.find({ 'metadata.linkage': mongoose.Types.ObjectId(req.user._id) }, { limit: 1 }).forEach(pic => {
//        gfs.find({ }).forEach(pic => {

        console.log("i")
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
})




module.exports = router