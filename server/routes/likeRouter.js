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

router.post('/like', addLike)
router.post('/view', addView)
router.get('/delete-all', deleteAll)


module.exports = router; 