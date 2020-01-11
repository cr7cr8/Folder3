
const session = require("express-session")
const { connDB4_2,secret } = require("../db/db")
const MongoStore = require("connect-mongo")(session)


module.exports = {

    mySession: session({

        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: connDB4_2 }),
        cookie: {}
    })

};