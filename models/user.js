const { wrapAndMerge } = require("../db/db")
const { User } = require("../db/schema")
const path = require("path")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const { passportConfig } = require("./passportConfig");

passportConfig(passport, verifyUserLogic);

let count = 0;


const viewFolderPath = path.join(__dirname, `../views/${path.parse(__filename).name}`)


const nameField = Object.keys(User.schema.tree)[0];
const passwordField = Object.keys(User.schema.tree)[1];


function verifyUserLogic(req, nameToVerify, passowrdToVerify, done) {
    //  console.log(req.path, User.db.name)
    // console.log(mongoose.connections[1].db)

    User.findOne({ [nameField]: nameToVerify }).exec()
        .then(function (u) {

            if (req.path === "/login") {
                if (!u) {

                    return done(null, false, { message: "no user with that email" })
                }
                else {

                    bcrypt.compare(passowrdToVerify, u.password).then(equal => {

                        return equal ? done(null, u) : done(null, false, { message: "password incorrect" })
                    }).catch(e => {
                        return done(e)
                    })
                }
            }
            else if (req.path === "/register") {
                if (u) {
                    return done(null, false, { message: "user already registed" })
                }
                else {

                    User.create({
                        [nameField]: nameToVerify,
                        [passwordField]: bcrypt.hashSync(passowrdToVerify)
                    }).then(u => {
                        done(null, u);
                    }).catch(e => {

                        done(e)
                    })

                }
            }
        })
        .catch(function (ex) {
            return done(null, false, { message: `DataBase error<br />${ex.stack}` })
        })

};


function loginUserFunc(req, res, next) {

    passport.authenticate("local", { successRedirect: req.session.toPage, failureRedirect: "/u/login", failureFlash: true })(req, res, next)
}

function registerUserFunc(req, res, next) {
    passport.authenticate("local", { successRedirect: req.session.toPage, failureRedirect: "/u/register", failureFlash: true })(req, res, next)
}

function checkAuthenticated(req, res, next) {


    if (req.isAuthenticated()) {
        //  throw new Error("eeeeee");
        next()

    }
    else {
        //  console.log("...", req.path)
        req.flash("msg", `please login first`)
        req.flash("toPage", `from ${req.session.toPage}`)


        //  console.log("//////////",req.flash("msg"),req.flash("toPage"))
        res.render(viewFolderPath + "/login", { Port: process.env.PORT || 80, count: count++, msg: req.flash("msg"), fromPage: req.flash("toPage"), session: JSON.stringify(req.session) })


        //res.redirect("/u/login")
    }
}




function checkNotAuthenticated(req, res, next) {

    if (!req.isAuthenticated()) {

        res.render(viewFolderPath + req.path, { Port: process.env.PORT || 80, count: count++, msg: req.flash("msg"), fromPage: req.flash("toPage"), session: JSON.stringify(req.session) })

    } else {

        res.redirect(req.session.toPage)
    }
}

function logoutFunc(req, res, next) {
    req.session.destroy();
    req.logOut(); res.redirect("/u/login")
}







module.exports = {
    ...wrapAndMerge(loginUserFunc, registerUserFunc, checkAuthenticated, checkNotAuthenticated, logoutFunc),
}










