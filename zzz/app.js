//const express = require("express")
//const app = express()



module.exports = function (app, express, mySession, passport, user, message) {

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


            req.session.toPage =
                (param1.match(/^u\??/) || paramLast.match(/^([\w-]+)\.([\w-]+)$/))
                    ? req.session.toPage || "/m/home"
                    : req.url;

            console.log(req.url, "  ---------  ", req.session.toPage);


            next()
        }

        function badUrl() {
            (req.url.match(/^\/$/))
                ? res.redirect("/m/home")
                : res.send(`<h2>bad request url <br />${req.url}</h2>`)
        };


    })


    app.use("/u", user)
    app.use("/m", message)

    app.listen(process.env.PORT || 80)

}