//Import Dependencies
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const mongoose = require("./db/conn")
const User = require("./models/user")
require("dotenv").config()
const {PORT} = process.env
const morgan = require("morgan")
const cors = require("cors")
const getData = require("./youtubeapi/apiCalls")
require('dotenv').config()


//Middleware
app.use(cors())
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.static("public"))


//Routes
app.get('/', async (req, res) => {
  const user = await User.create({name: "Hridoy",age:23,email:"me@hridoymh.com",userName:"hridoy",profession:"Student",roll:"Teacther"})
  res.send('Hello World!')
})

app.get('/data', async (req, res) => {
  const data = await getData()
  res.json(data.data)
})


app.post('/login', async (req,res) => {
  //auth
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({email:email,password:password})

  if(!user) return res.json({status:"user not found"})
  else {
    const accessToken = generateAccessToken({userid: user.id})
    return res.json({status: "success", accessToken: accessToken,userId:user.id, userName:user.name })
  }
  
})
function generateAccessToken(user) {
  return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
}


app.post('/signup', async (req,res)=>{
  
  if(await User.exists({email:req.body.email})){
    res.json({status: "Data already exists."})
  }
  else{
  const user = User.create({name:req.body.name,email:req.body.email,password:req.body.password}).then((result)=>{
    res.json({status:"Successfully registared."})
  }).catch((err)=>{
    res.json({status:"there is some problem"})
  })
}

})


app.get('/update', async (req,res)=>{
  const user = await User.findOne({age:22})
  user.enrolledCourses[0] = "edited"
  user.save()
  console.log(user)
  res.send("updated")
})

app.get('/addcourse', async (req,res)=>{
  const data = await getData("C++ Full Course | Data Structures & Algorithms","desc","PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR","6484d738965246653e0c8b81")
  res.send(data)
})


//listenter
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})