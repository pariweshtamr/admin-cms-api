import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import helmet from 'helmet'
import morgan from 'morgan'

const PORT = process.env.PORT || 8000

// Connect MongoDB
import mongoClient from './config/db.js'
mongoClient()

//MIDDLEWARES
app.use(helmet())
app.use(morgan('tiny'))
app.use(express.urlencoded())
app.use(express.json())

//LOAD ROUTERS
import userRouter from './routers/userRouter.js'

// Use ROUTERS
app.use("/api/v1/user", userRouter)

app.use("/", (req, res)=>{
    res.json({ message: 'hello world' })
})

app.listen(PORT, (error) => {
    if(error){
        return console.log(error)
    }
    console.log(`Server is running at http://localhost:${PORT}`)
})