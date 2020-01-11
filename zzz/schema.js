const mongoose = require("mongoose");
const Joi = require("joi");



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
messageSchema.statics = {

    // deleteMessage: function (message) {
    //     const caller = this;
    //     return new Promise(function (resolve, reject) {
    //         caller.deleteMany(message, function (err) {
    //             (err) ? reject(err) : resolve(message)
    //         });
    //     })
    // },

    // deleteMessageById:function(id){
    //     const caller = this;
    //     return new Promise(function (resolve, reject) {

    //         caller.deleteOne({_id:id},function(err){
    //             (err) ? reject(err) : resolve(id)
    //         });


    //     })

    // }



}
//////
// Message.find({ item: req.params.item, author: req.user.name }).deleteMany(function (err) {

//     res.send(req.params.item)
// })
///////////////////////////////////////////////////////////





const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: false
    },


    /*
        email: {
            type: String,
            //required: true,
            unique: false,
            minlength: 3,
            maxlength: 250
        },
    */
    password: {
        type: String,
        required: true,

        minlength: 3,
        maxlength: 1024
    }


}, { timestamps: true, collection: "users" })

userSchema.methods = {
    showCollectionName: () => { console.log(this) },
    showTheCollectionName: function () { console.log(this) }

}


userSchema.statics = {

    joiValidate: function (obj) {


        const schema = {
            name: Joi.string().min(5).max(255).required(),
            email: Joi.string().min(5).max(255).email(),
            password: Joi.string().min(5).max(1024).required()

        }
        return Joi.validate(obj, schema)
    },
    authValidate: function (obj) {


        const schema = {

            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(1024).required()

        }
        return Joi.validate(obj, schema)



    }

}
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




module.exports = { userSchema, messageSchema, metadataSchema }