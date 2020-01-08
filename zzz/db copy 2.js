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
                    const obj = fn(req, res, next);
                    return (Promise.resolve(obj) === obj)
                        ? obj.catch(ex => res.send(`<h1>Async error from function<br /> ${fn.name}<br /> ${ex}</h1>`))
                        : obj

                }
                catch (ex) { res.send(`<h1>something wrong when calling function  <br /> ${fn.name}<br /></h1> ${ex.stack}`) }
            }
        }
    }).reduce(
        function (accumulator, currentValue) {
            return { ...accumulator, ...currentValue }
        })
}





module.exports = {
    connDB1: connDB1(), connDB4: connDB4(), connSession: connDB4(),
    secret, wrapAndMerge
}

