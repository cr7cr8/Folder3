const path = require("path")
const fs = require("fs")

module.exports = function (dirname, filename) {
    return function (req, res, next) {

        const viewFilePath = path.join(dirname, `../views/${path.parse(filename).name}`)
        const viewFileName = req.path.split("/")[1];


        if (viewFileName.match( /^\w+$/g)) {

            fs.exists(path.join(viewFilePath, viewFileName + ".ejs"), (isExist) => {
             
                if (!isExist) {
                    fs.writeFileSync(path.join(viewFilePath, viewFileName + ".ejs"), `<h1>${viewFileName}</h1>`)
                    return res.render(path.join(viewFilePath, viewFileName + ".ejs"))
                }
                else {


                     return res.render(path.join(viewFilePath, viewFileName + ".ejs"))
                }
            })
        }
        else {
            res.status(404).send(`not found ${req.url}`)

          
        }



    }
}