const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    vidNum: {
        type: Number
    },
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
    },
    views: {
        type: Number,
        default: 0
    },
    isSuperliked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Video = mongoose.model('Video', videoSchema)
module.exports = Video