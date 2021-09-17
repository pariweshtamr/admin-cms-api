import express from 'express'
const Router = express.Router()


Router.all("/", (req, res, next) => {
    res.json({
        status: "success",
        messsage: "from catalog router"
    })
})

export default Router