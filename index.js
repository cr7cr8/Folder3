const express = require("express")
const app = express()
const { mySession } = require("./models/sessionConfig");
const passport = require("passport")
const user = require("./controllers/user")
const message = require("./controllers/message")



// require("./models/app")(app,express,mySession,passport,user,message)


app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(mySession)
app.use(passport.initialize())
app.use(passport.session())



app.use(function (req, res, next) {

    req.url.match(/^(\/[^\/]+){2,}\/$/)
        ? res.redirect(req.url.slice(0, -1))
        : null

    req.url.match(/^(\/[^\/]+){2,}$/)
        ? goodUrl()
        : badUrl()
    function goodUrl() {

        const address = req.url.match(/^(\/[^\/]+){2,}$/).filter(e => e !== "")
        const [param1, param2] = address[0].split("/").filter(e => e !== "");
        const [paramLast] = address[1].split("/").filter(e => e !== "");

    //  const [[param1, param2], [paramLast]] = [address[0].split("/").filter(e => e !== ""), address[1].split("/").filter(e => e !== "")]
        req.session.toPage =
            (param1.match(/^u\??/) || paramLast.match(/^([\w-]+)\.([\w-]+)$/))
                ? req.session.toPage || "/m/home"
                : req.url;

        // console.log(req.url, "  ---------  ", req.session.toPage);

        next()
    }

    function badUrl() {
        (req.url.match(/^\/$/))
            ? res.redirect("/m/home")
            : res.send(`<h2>bad request url <br />${req.url}</h2>`)
    };


})

// process.on("uncaughtException",ex=>{
//     console.log("====================",ex)
// })


app.use("/u", user)
app.use("/m", message)


app.use(function (req, res) {


    res.header(404).send(`<h2>${req.url}</h2> <br /> 404 <a href='/m/home'>m/home</a>`)

})

app.listen(process.env.PORT || 80)


