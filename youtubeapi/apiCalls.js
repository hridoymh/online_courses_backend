const axios = require("axios")
const courseModel = require("../models/course")



const key = "AIzaSyCX7FOEluNbqAMGcGxgNZ1WQMDpoq6KbNw"
const playListId = "PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR"
const baseurl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&key=AIzaSyCX7FOEluNbqAMGcGxgNZ1WQMDpoq6KbNw"

const getURLbyData = (key,playListId,nextToken) => {
    return `https://www.googleapis.com/youtube/v3/playlistItems?pageToken=${nextToken}&part=snippet&maxResults=50&playlistId=${playListId}&key=${key}`
}

const getNextPage = (key,playListId,nextToken) => {
    return `https://www.googleapis.com/youtube/v3/playlistItems?pageToken=${nextToken}&part=snippet&maxResults=50&playlistId=${playListId}&key=${key}`
}

const getData = async (title,desc,url,owner) => {
    const course = await courseModel.create({title:title,description:desc,url:url,owner:owner,items:[]})
    let flag = 1;
    let nextToken = ""
    while(flag==1){
        let res = await axios.get(getURLbyData(key,playListId,nextToken))
        res.data.items.map(item => {
            course.items.push(item)
        })
        console.log(res.data)
        if(res.data.hasOwnProperty("nextPageToken"))
        {
            nextToken = res.data.nextPageToken
        }
        else {
            flag = 0;
        }
    }
    await course.save()
    return "done"
}

module.exports = getData