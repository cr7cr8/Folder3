
const { Strategy } = require("passport-local")




function passportConfig(passport, verifyUserLogic) {
    passport.use(new Strategy(
        { usernameField: "username", passwordField: "password", passReqToCallback: true },

        verifyUserLogic


    ))


    passport.serializeUser(function (token, passIn) {
        //   console.log("serializing   ", token)
        passIn(null, token)

    })
    passport.deserializeUser(function (token, fetchOut) {
        //   console.log("deserializing   ", token)
        fetchOut(null, token)
    })
}



module.exports = {
   
    passportConfig: passportConfig,
  
};