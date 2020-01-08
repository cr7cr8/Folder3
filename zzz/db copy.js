const mongoose = require("mongoose")
//const Promise = require("bluebird");


const { connDB1, connDB4, secret } = {
    DB4: "mongodb+srv://boss:ABCabc123@cluster0-iiqnu.azure.mongodb.net/DB4?poolSize=10&retryWrites=true&w=majority",
    DB1: "mongodb+srv://boss:ABCabc123@cluster0-iiqnu.azure.mongodb.net/DB1?poolSize=10&retryWrites=true&w=majority",
    secret: "session private key",
    connParam: { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },

    get connDB1() { return mongoose.createConnection.bind(mongoose, this.DB1, this.connParam) },
    get connDB4() { return mongoose.createConnection.bind(mongoose, this.DB4, this.connParam) },
}

function wrapAndMerge(...args) {

    return args.map(function (fn) {
        return {
            [fn.name]: function (req, res, next) {
                try {
                    // Promise.try(  fn.bind(null,req,res,next) ).catch(a=>res.send(a))
                    //new Promise(function (good, bad) { good(fn(req, res, next)) }).catch(a => res.send(a))
                    Promise.resolve(fn(req, res, next))
                    .catch(ex =>res.send(`<h1>Promise rejected <br /> ${fn.name}<br /></h1> ${ex.stack}`) )
                }
                catch (ex) { res.send(`<h1>something wrong when calling function  <br /> ${fn.name}<br /></h1> ${ex.stack}`) }
            }
        }
    }).reduce(
        function (accumulator, currentValue) {
            return { ...accumulator, ...currentValue }
        })
}


function wrapAndMerge2(...args) {


    return args.map(function (fn) {
        return {
            [fn.name]: function (req, res, next) {
                return Promise.try(
                    //   function () {
                    //  throw new Error("dfdfdfdf")
                    fn.bind(null, req, res, next)
                    //    }

                ).catch((ex) => { console.log("kkkk"); res.send(`<h1>something wrong when calling function  <br /> ${fn.name}<br /></h1> ${ex.stack}`) })

            }
        }

    }).reduce(
        function (accumulator, currentValue) {
            return { ...accumulator, ...currentValue }
        })

}



module.exports = {
    connDB1: connDB1(), connDB4: connDB4(), connSession: connDB4(),
    secret, wrapAndMerge, wrapAndMerge2
}

