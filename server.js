import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import helmet from 'helmet'

const PORT = process.env.PORT || 8000

// Connect MongoDB
import mongoClient from './config/db.js'
mongoClient()

//MIDDLEWARES
app.use(helmet())


app.use("/", (req, res)=>{
    res.json({ message: 'hello world' })
})


app.listen(PORT, (error) => {
    if(error){
        return console.log(error)
    }
    console.log(`Server is running at http://localhost:${PORT}`)
})