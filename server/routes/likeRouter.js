const express = require('express');
const router = express.Router();


const addLike = async (req, res) => {
    
    try {
        
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

router.post('/', addLike)

module.exports = router; 