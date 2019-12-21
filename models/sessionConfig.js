
const session = require("express-session")
const { secret, connSession } = require("../db/db")
const MongoStore = require("connect-mongo")(session)


module.exports = {

    mySession: session({

        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: connSession }),
        cookie: {}
    })

};