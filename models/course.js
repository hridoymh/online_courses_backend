const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    owner: String,
    thumb: String,
    price: String,
    cat: String,
    items: []
})



module.exports = mongoose.model("Courses",courseSchema)