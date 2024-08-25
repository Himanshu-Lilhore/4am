const express = require('express');
const router = express.Router();
const Video = require('../models/videoModel');

const addLike = async (req, res) => {
    try {
        const vidExists = await Video.findOne({ size: req.body.size, duration: req.body.duration })
        if (!vidExists) {
            const newVid = await Video.create({
                ...req.body,
                likes: parseInt(req.body.likes),
                views: 1
            })
            console.log("Video record created & like added!!")
            res.status(200).json("Video record created & like added!")
        } else {
            vidExists.likes += parseInt(req.body.likes);
            await vidExists.save();
            res.status(200).json("Like count updated !");
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
                likes: parseInt(req.body.likes),
                views: 1
            })
            console.log("Video record created & view added!!")
            res.status(200).json("Video record created & view added!")
        } else {
            vidExists.views++;
            await vidExists.save();
            res.status(200).json("View count updated !");
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

router.post('/like', addLike)
router.post('/view', addView)


module.exports = router; 