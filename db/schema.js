const mongoose = require("mongoose");
const { connDB1, connDB1_2, connDB4 } = require("./db")

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

const metadataSchema = new mongoose.Schema({
    metadata: {
        type: {
            message: {
                type: mongoose.Schema.Types.ObjectId, //ref: 'messages' 
            },
            owner: {
                type: mongoose.Schema.Types.ObjectId,// ref: 'users'
            }
        }, //ref: "messages"
    },
})

const Metadata = connDB1_2.model("pic_uploads.files", metadataSchema);


module.exports = {
    userSchema, messageSchema, metadataSchema,
    Message, User, Metadata
}