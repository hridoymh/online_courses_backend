const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    owner: String,
    items: []
})



module.exports = mongoose.model("Courses",courseSchema)