const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    owner: String,
    thumb: String,
    price: String,
    cat: String,
    items: [],
    chats: []
})



module.exports = mongoose.model("Courses",courseSchema)