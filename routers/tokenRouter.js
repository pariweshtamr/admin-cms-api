import express from 'express'
const Router = express.Router()
import {
  getUserByEmailAndRefreshToken,
  getUserByEmail,
} from '../models/user-model/User.model.js'
import { verifyRefreshJWT, createAccessJWT } from '../helpers/jwt.helper.js'
import { createUniqueOTP } from '../models/pin/Pin.model.js'
import { sendPasswordResetOtp } from '../helpers/email.helper.js'

Router.all('/', (req, res, next) => {
  console.log('token got hit')

  next()
})

Router.get('/', async (req, res) => {
  try {
    const { authorization } = req.headers
    //1. check if the token is valid
    const { email } = verifyRefreshJWT(authorization)

    console.log(email)

    //2. get the user info
    if (email) {
      // get user id from db by email
      const filter = {
        email,
        refreshJWT: authorization,
      }
      const user = await getUserByEmailAndRefreshToken(filter)
      console.log(user)
      if (user?._id) {
        const accessJWT = await createAccessJWT({ _id: user._id, email })
        console.log(accessJWT)
        return res.json({
          accessJWT,
        })
      }
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthenticated',
    })
  } catch (error) {
    console.log(error)
    res.status(401).json({
      status: 'error',
      message: 'Unauthenticated',
    })
  }
})

//request OTP for password reset
Router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body
    //get the email
    if (email) {
      // get the user by email
      const user = await getUserByEmail(email)

      if (user?._id) {
        //create an otp and store in the token along with user_id
        const result = await createUniqueOTP({
          email,
          type: 'passwordResetOtp',
        })
        if (!result?._id) {
          return res.json({
            status: 'error',
            message: 'Error, please try again later',
          })
        }
        //send email with the OTP and then
        const emailObj = {
          email,
          otp: result.pin,
          fname: user.fname,
        }
        sendPasswordResetOtp(emailObj)
      }
    }

    res.json({
      status: 'success',
      message:
        'If the email exists in our system, we will send you an OTP shortly. OTpP will expire in 15 minutes',
    })
  } catch (error) {
    console.log(error)
    res.json({
      status: 'error',
      message: 'Error, unable to process your request.',
    })
  }
})

export default Router
