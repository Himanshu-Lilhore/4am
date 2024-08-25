const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    size: {
        type: String
    },
    duration: {
        type: String
    },
    title: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const Video = mongoose.model('Video', videoSchema)
module.exports = Video