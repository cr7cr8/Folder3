const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const { connDB1, connDB1_2, connDB2, connDB4 } = require("./db")

//const Joi = require("joi");
const messageSchema = new mongoose.Schema({

    item: {
        type: String, minlength: 1
    },
    author:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    pic: {
        type: Boolean,
        default: false
    },
    //  [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
}, { timestamps: true, collection: "messages" })
messageSchema.statics = {}
const Message = connDB1.model("messages", messageSchema);
/////////////////////////////////////////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: false
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    }
}, { timestamps: true, collection: "users" })
userSchema.methods = {}//showCollectionName: () => { console.log(this) }, showTheCollectionName: function () { console.log(this) }
userSchema.statics = {}
const User = connDB4.model("users", userSchema);

///////////////////////////////////////////////////////////////////////////////////////////////
// const picSchema = new mongoose.Schema({

//     linkage: {
//         type: mongoose.Schema.Types.ObjectId, //ref: 'messages' 
//     },
//     message: {
//         type: mongoose.Schema.Types.ObjectId, //ref: 'messages' 
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,// ref: 'users'
//     }

// }, { timestamps: true, collection: "pic_uploads" })

// picSchema.methods = {
//     upload: function (req, res, next) {
//         return multerUpload(this).fields([{ name: "metadata", maxCount: 1 }, { name: 'file', maxCount: 1 }, { name: 'mmm', maxCount: 1 }])(req, res, next)
//     },
// }

// picSchema.statics = {
//     download: function (req, res) {

//         return multerDownload.call(this, req, res)
//     }
// }

//const Pic = connDB1_2.model("pic_uploads", picSchema);
const Pic = createFileModel({connDB:connDB1_2,collectionName:"pic_uploads"})


/////////////////////////////////////////////////////////////////////////////////////////////////



function createFileModel({ connDB, collectionName }) {
    const fileSchema = new mongoose.Schema({
        obj:{ type:Object  }
   
    }, {timestamps: true,collection:collectionName})
    fileSchema.methods = {
        upload: function (req, res, next) {
            return multerUpload(this).fields([{ name: 'file', maxCount: 1 }])(req, res, next)
        },

    };
    fileSchema.statics = {
        download: function (req, res) {
            return multerDownload.call(this, req, res)
        },
        delete:function(req,res){
            return multerDelete.call(this, req, res)
        }
    
    
    };

    return connDB.model(collectionName, fileSchema)
}




/////////////////////////////////////////////////////////////////////////////////////////////////
const profileSchema = new mongoose.Schema({

    linkage: {
        type: mongoose.Schema.Types.ObjectId,
    },
    profileName: {
        type: mongoose.Types.ObjectId //ref users
    }
    //      backgroudImg: mongoose.Types.ObjectId,
}, { timestamps: true, collection: "profile_uploads" })
profileSchema.statics = {}
const Profile = connDB2.model("profile_uploads", profileSchema);






///////////////////////////////////////////////////////////////////////////////////////



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
                    metadata: model.obj,
                });
            })
            // cannot use then, otherwise file will not be uploaded into pic_file collection, file name will not be correct

        }
    });
    return multer({ storage: storage });
}

function multerDownload(req, res) {
    var gfs = new mongoose.mongo.GridFSBucket(this.db.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: this.schema.options.collection,
    });
    gfs.find({ 'metadata.linkage': mongoose.Types.ObjectId(req.params.id) }, { limit: 1 }).forEach(pic => {

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

function multerDelete(req,res){
    var gfs = new mongoose.mongo.GridFSBucket(this.db.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: this.schema.options.collection
    });
    return gfs.find({ 'metadata.linkage': mongoose.Types.ObjectId(req.params.id) }, { limit: 1 }).forEach(pic => {

        if (!pic) { return res.send("pic not in database") }
        gfs.delete(mongoose.Types.ObjectId(pic._id), function (err) {

            if (err) { console.log(err) }
            else {
                res.send(pic._id)
            }

        })
    })

}






///////////////////////////////////////////////////////////
module.exports = {
    // userSchema, messageSchema,// metadataSchema,
    Message, User, Pic,
    Profile,
    createFileModel
}