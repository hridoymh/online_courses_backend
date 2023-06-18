const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    completedCourses: [],
    enrolledCourses: [],
    uploadedCourses: [],
    count: []
})



module.exports = mongoose.model("User",userSchema)