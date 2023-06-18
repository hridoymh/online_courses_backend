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
const course = require('./models/course')
require('dotenv').config()

//Middleware
app.use(cors())
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.static("public"))







//Routes
app.get('/', async (req, res) => {
  
  res.send('Hello World!')
})

app.post('/userdata', authenticateToken, async (req, res) => {
  const data = await User.findOne({_id:req.user.userid})
  data.uploadedCourses = await course.find({'_id':data.uploadedCourses},['title','thumb', 'description', '_id'])
  data.completedCourses = await course.find({'_id':data.completedCourses},['title','thumb', 'description', '_id'])
  data.enrolledCourses = await course.find({'_id':data.enrolledCourses},['title','thumb', 'description', '_id'])
  
  res.json(data)
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

app.post('/addcourse', authenticateToken, async (req,res)=>{
  // const data = await getData("C++ Full Course | Data Structures & Algorithms","desc","PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR","6484d738965246653e0c8b81")
  
  const datares = await getData(req.body.title,req.body.description,req.body.url,req.user.userid,req.body.price)
  res.json({status:datares})
})

app.get("/getcourses",async (req,res)=>{
  const data = await course.find({},["title","description","thumb","_id","price"])
  console.log(data)
  res.json(data)
})

app.post("/enroll",authenticateToken, async (req,res)=>{
  const data = await User.findOne({_id:req.user.userid})
  data.enrolledCourses.push(req.body.course)
  data.count.push({id:req.body.course,completed:0})
  await data.save()
  res.json({status:"enrolled"})
})

app.get("/course/:id", async (req,res)=>{
  const data =  await course.findOne({_id:req.params.id})
  res.send(data)
})


//functions
function generateAccessToken(user) {
  return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
}

function authenticateToken(req, res, next){
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
      if(err) return res.sendStatus(403)
      // console.log(user)
      req.user = user
      next()
  })
}



//listenter
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})