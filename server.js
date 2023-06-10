//Import Dependencies
const express = require('express')
const app = express()
const mongoose = require("./db/conn")
const User = require("./models/user")
require("dotenv").config()
const {PORT} = process.env
const morgan = require("morgan")
const cors = require("cors")


//Middleware
app.use(cors())
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.static("public"))


//Routes
app.get('/', async (req, res) => {
  const user = await User.create({name: "MH Hridoy",age:23,email:"me@hridoymh.com",userName:"hridoymh",profession:"Student"})
  res.send('Hello World!')
})

app.get('/update', async (req,res)=>{
  const user = await User.findOne({age:22})
  user.enrolledCourses[0] = "edited"
  user.save()
  console.log(user)
  res.send("updated")
})


//listenter
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})