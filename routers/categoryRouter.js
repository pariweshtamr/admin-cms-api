import express from 'express'
const Router = express.Router()
import slugify from 'slugify'
import { addCategory } from "../models/category/Category.model.js";


Router.all("/", (req, res, next) => {
    next()
})

// Create new category
Router.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const slug = slugify(req.body.name, {lower: true})
        console.log(slug)

        const result = await addCategory({...req.body, slug})

        const status = result?._id ? "success" : "error"

        const message = result?._id ? "Category has been created successfully" : "Unable to create the category. Please try again later"

        res.send({status, message})
    } catch (error) {
        console.log(error)
        
        let msg = 'Error, unable to add new category at the moment. Please try again later'

        if(error.message.includes("E11000 duplicate key error collection")){
            msg = 'Error, the category already exists'
        }

        res.send({
            status: 'error',
            message: msg
        })
        
    }
})

export default Router