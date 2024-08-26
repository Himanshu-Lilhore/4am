const express = require('express');
const router = express.Router();
const Video = require('../models/videoModel');

const addLike = async (req, res) => {
    try {
        const vidExists = await Video.findOne({ size: req.body.size, duration: req.body.duration })
        if (!vidExists) {
            const newVid = await Video.create({
                ...req.body,
                likes: 1,
            })
            console.log(`${req.body.vidNum} - record created & ❤️(like) added!!`)
            res.status(200).json(`${req.body.vidNum} - record created & ❤️(like) added!`)
        } else {
            vidExists.likes += 1;
            await vidExists.save();
            res.status(200).json(`${req.body.vidNum} - ❤️(like) count updated !`);
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const addView = async (req, res) => {
    try {
        const vidExists = await Video.findOne({ size: req.body.size, duration: req.body.duration })
        if (!vidExists) {
            const newVid = await Video.create({
                ...req.body,
                views: 1
            })
            console.log(`${req.body.vidNum} - record created & 👁️(view) added!!`)
            res.status(200).json(`${req.body.vidNum} - record created & 👁️(view) added!`)
        } else {
            vidExists.views++;
            await vidExists.save();
            res.status(200).json(`${req.body.vidNum} - 👁️(view) count updated !`);
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


const deleteAll = async (req, res) => {
    try {
            await Video.deleteMany({})
            console.log("🗑️ - video records are now cleared.")
            res.status(200).json({ message: "🗑️ - video records are now cleared." })
    } catch (err) {
        res.status(400).json({ error: err.message })
        console.log(err.message)
    }
}


const showAll = async (req, res) => {
    try {
        const allVideos = await Video.find()
        res.status(200).json(allVideos)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


const deleteOne = async (req, res) => {
    try {
        const deletedVideo = await Video.deleteOne({ _id: req.body._id });
        if (!deletedVideo.deletedCount) {
            return res.status(404).json({ error: 'Record not found' });
        }
        console.log('Record deleted : ', req.body._id)
        res.status(200).json({ message: 'Record deleted successfully', deletedVideo });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


router.post('/like', addLike)
router.post('/view', addView)
router.get('/delete-all', deleteAll)
router.get('/show-all', showAll)
router.delete('/delete', deleteOne)


module.exports = router; 