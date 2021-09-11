import express from 'express'
const Router = express.Router()
import {createUser} from '../models/user-model/User.model.js'
import { createAdminUserValidation } from '../middlewares/formValidation.middleware.js'

Router.all("/", (req, res, next) => {
    console.log('from user router')
    next()
})

Router.post ("/", createAdminUserValidation, async (req, res) => {
    console.log(req.body)
    try {
        // TODO
        
        // encrypt password

        const result = await createUser(req.body)

        if(result?._id){
            // TO DO
            // Create unique activation link and email the link to user email
            return res.json({
                state: 'success',
                message: 'New user has been created successfully! We hav sent an email confirmation to your email, please check and follow the instructions to verify and activate your account'
            })
        }

        res.json({
            state: 'error',
            message: 'Unable to create new user'
        })

    } catch (error) {
        let msg = "Error, Unable to create user"
        console.log(error.message)
        if(error.message.includes("E11000 duplicate key error collection")){
            msg="This email has already been used by another user."
        }
        res.json({
            state: 'error',
            message: 'Unable to create new user'
        })
    }
})

export default Router