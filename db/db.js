const mongoose = require("mongoose")
const {DB1,DB4,secret} = require("./config.js")


//console.log(url)

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
//     .then((mongoose) => {
       
//         console.log(mongoose.connection.db.databaseName,"   db.js")
//     })
//     .catch(e=>{

//         console.log("From db---db.js  connection error",e)
//     })


const newConnDB1 = mongoose.createConnection.bind(mongoose, DB1, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const newConnDB4 = mongoose.createConnection.bind(mongoose, DB4, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })


 //mongoose.Promise = global.Promise;
 //module.exports = mongoose.createConnection(DB4, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })


 module.exports = {connDB1: newConnDB1(),connDB4:newConnDB4(), connSession: newConnDB4(),  secret:secret}
 //module.exports = {connDB1: mongoose.connections[1],connDB4:mongoose.connections[2],secret:secret}

