const axios = require("axios")
const courseModel = require("../models/course")
const User = require("../models/user")



const key = "AIzaSyCX7FOEluNbqAMGcGxgNZ1WQMDpoq6KbNw"
const playListId = "PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR"
const baseurl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&key=AIzaSyCX7FOEluNbqAMGcGxgNZ1WQMDpoq6KbNw"

const getURLbyData = (key,playListId,nextToken) => {
    return `https://www.googleapis.com/youtube/v3/playlistItems?pageToken=${nextToken}&part=snippet&maxResults=50&playlistId=${playListId}&key=${key}`
}

const getNextPage = (key,playListId,nextToken) => {
    return `https://www.googleapis.com/youtube/v3/playlistItems?pageToken=${nextToken}&part=snippet&maxResults=50&playlistId=${playListId}&key=${key}`
}

const getData = async (title,desc,url,owner,price,cat) => {
    try{
    const course = await courseModel.create({title:title,description:desc,url:url,owner:owner,thumb:"",price:price,items:[],chats:[],cat:cat})
    let flag = 1;
    let nextToken = ""
    while(flag==1){
        let res = await axios.get(getURLbyData(key,url,nextToken))
        res.data.items.map(item => {
            course.items.push(item)
        })
        
        if(res.data.hasOwnProperty("nextPageToken"))
        {
            nextToken = res.data.nextPageToken
        }
        else {
            flag = 0;
        }
    }
    const img = course.items[0].snippet.thumbnails.medium.url
    console.log(img)
    course.thumb = img
    const user = await User.findOne({_id:owner})
    user.uploadedCourses.push(course._id)
    await user.save()
    await course.save()
    return "done"
    }
    catch{
        return "not done"
    }
}

module.exports = getData