const mongoose = require("mongoose")
const config = {useNewUrlparser:true,useUnifiedTopology:true}
const url = "mongodb://localhost:27017/Hridoy"


mongoose.connect(url,config)


mongoose.connection.on("open",()=>console.log("You are connected to mongo."))

module.exports = mongoose