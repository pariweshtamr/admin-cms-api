import express from 'express'
const Router = express.Router()
import {createUser, verifyEmail} from '../models/user-model/User.model.js'
import { createAdminUserValidation, adminnEmailVerificationValidation } from '../middlewares/formValidation.middleware.js'
import {hashPassword} from '../helpers/bcrypt.helper.js'
import {createUniqueEmailConfirmation, findAdminEmailVerification, deleteInfo} from '../models/session/Session.model.js'
import {sendEmailVerificationLink, sendEmailVerificationCOnfirmation} from '../helpers/email.helper.js'

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
                sendEmailVerificationLink(forSendingEmail)
            }

            return res.json({
                status: 'success',
                message: 'New user has been created successfully! We hav sent an email confirmation to your email, please check and follow the instructions to verify and activate your account'
            })
        }
        }

        res.json({
            status: 'error',
            message: 'Unable to create new user'
        })

    } catch (error) {
        let msg = "Error, Unable to create user"
        console.log(error.message)
        if(error.message.includes("E11000 duplicate key error collection")){
            msg="This email has already been used by another user."
        }
        res.json({
            status: 'error',
            message: 'Unable to create new user'
        })
    }
})


//email verification
Router.patch("/email-verification", adminnEmailVerificationValidation, async (req, res) => {
    try {
        const result = await findAdminEmailVerification(req.body)

        if (result?._id){
            //TODO
            //information is valid now we can update the user 
            const data = await verifyEmail(result.email)

            if(data?._id){
                // delete the session info
                deleteInfo(req.body)

                    // send email confirmation to user        
                sendEmailVerificationCOnfirmation({
                    fname: data.name,
                    email: data.email,
                })
                
                return res.json({
                    status: 'success',
                    message: 'Your email has been verified. You may log in now.',
                })

            } 
        }
        res.json({
            status: 'error',
            message: 'Unable to verify your email. Either the link is invalid or expired.',
        })

    } catch (error) {
        res.json({
            status: 'error',
            message: 'Error, Unable to verify the email. Please try again later.',
        })
    }
})

export default Router