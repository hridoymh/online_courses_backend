const mongoose = require("mongoose")

const liveSchema = new mongoose.Schema({
    student: String,
    teacher: String,
    time: String,
    date: String,
    status: String
})



module.exports = mongoose.model("lives",liveSchema)