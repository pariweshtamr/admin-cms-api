import express from 'express'
const Router = express.Router()
import {createUser} from '../models/user-model/User.model.js'
import { createAdminUserValidation } from '../middlewares/formValidation.middleware.js'
import {hashPassword} from '../helpers/bcrypt.helper.js'
import {createUniqueEmailConfirmation} from '../models/session/Session.model.js'
import {emailProcessor} from '../helpers/email.helper.js'

Router.all("/", (req, res, next) => {
    console.log('from user router')
    next()
})

Router.post ("/", createAdminUserValidation, async (req, res) => {
    // console.log(req.body)
    try {
        // encrypt password
        const hashPass = hashPassword(req.body.password)
        // console.log(hashPass)
        if(hashPass){
        
        req.body.password=hashPass
        console.log(hashPass)

        const {_id, fname, email} = await createUser(req.body)

        if(_id){
            // TODO
            // Create unique activation link
            const {pin} = await createUniqueEmailConfirmation(email)

            if(pin) {
                const forSendingEmail = {
                    fname,
                    email,
                    pin,
                }    
                emailProcessor(forSendingEmail)
            }

            return res.json({
                state: 'success',
                message: 'New user has been created successfully! We hav sent an email confirmation to your email, please check and follow the instructions to verify and activate your account'
            })
        }
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