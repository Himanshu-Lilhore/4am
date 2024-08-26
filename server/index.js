require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const app = express()
const vidRouter = require('./routes/vidRouter')
const PORT = process.env.PORT
const cors = require('cors')

connectDB()

app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
        if (!origin ||
            origin.startsWith(process.env.PROD_FRONTEND_URL) ||
            origin.startsWith(process.env.DEV_FRONTEND_URL)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}));


app.use('/meta', vidRouter)


app.listen(PORT, () => {
    console.log("server is running on ", PORT)
})