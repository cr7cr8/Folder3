

const config = {
    DB4: "mongodb+srv://boss:ABCabc123@cluster0-iiqnu.azure.mongodb.net/DB4?poolSize=10&retryWrites=true&w=majority",

    DB1: "mongodb+srv://boss:ABCabc123@cluster0-iiqnu.azure.mongodb.net/DB1?poolSize=10&retryWrites=true&w=majority",

    secret: "session private key",

   
   // newConnDB1: mongoose.createConnection.bind(mongoose, DB1, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }),
   // newConnDB4: mongoose.createConnection.bind(mongoose, DB4, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }),


}



module.exports = config

