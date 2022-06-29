import express from 'express'
const Router = express.Router()
import {
  createUser,
  verifyEmail,
  getUserByEmail,
  removeRefreshJWT,
  updateUserProfile,
  updateUserProfileByEmail,
} from '../models/user-model/User.model.js'
import { removeSession } from '../models/session/Session.model.js'
import {
  createAdminUserValidation,
  adminnEmailVerificationValidation,
  loginUserFormValidation,
  passwordUpdateFormValidation,
  forgotPasswordResetFormValidation,
} from '../middlewares/formValidation.middleware.js'
import { hashPassword, comparePassword } from '../helpers/bcrypt.helper.js'
import {
  createUniqueEmailConfirmation,
  findAdminEmailVerification,
  deleteInfo,
} from '../models/pin/Pin.model.js'
import {
  sendEmailVerificationLink,
  sendEmailVerificationCOnfirmation,
  sendPasswordUpdateNotification,
} from '../helpers/email.helper.js'
import { isAdminUser } from '../middlewares/auth.middleware.js'
import { getJWTs } from '../helpers/jwt.helper.js'

Router.all('/', (req, res, next) => {
  next()
})

Router.get('/', isAdminUser, (req, res) => {
  res.json({
    status: 'success',
    message: 'User Profile',
    user: req.user,
  })
})

//create new user
Router.post('/', createAdminUserValidation, async (req, res) => {
  try {
    // encrypt password
    const hashPass = hashPassword(req.body.password)
    if (hashPass) {
      req.body.password = hashPass

      const { _id, fname, email } = await createUser(req.body)

      if (_id) {
        // Create unique activation link
        const { pin } = await createUniqueEmailConfirmation(email)

        if (pin) {
          const forSendingEmail = {
            fname,
            email,
            pin,
          }
          sendEmailVerificationLink(forSendingEmail)
        }

        return res.json({
          status: 'success',
          message:
            'New user has been created successfully! We hav sent an email confirmation to your email, please check and follow the instructions to verify and activate your account',
        })
      }
    }

    res.json({
      status: 'error',
      message: 'Unable to create new user',
    })
  } catch (error) {
    let msg = 'Error, Unable to create user'
    console.log(error.message)
    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'This email has already been used by another user.'
    }
    res.json({
      status: 'error',
      message: 'Unable to create new user',
    })
  }
})

//update user
Router.patch('/', isAdminUser, async (req, res) => {
  try {
    const { _id } = req.user
    console.log(_id, req.body)

    if (_id) {
      const result = await updateUserProfile(_id, req.body)

      if (result?._id) {
        return res.json({
          status: 'success',
          message: 'User profile has been updated successfully',
        })
      }
    }

    return res.json({
      status: 'error',
      message: 'Unable to uppdate user information. Please try again later.',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      status: 'error',
      message: 'Unable to uppdate user information. Please try again later.',
    })
  }
})

//email verification
Router.patch(
  '/email-verification',
  adminnEmailVerificationValidation,
  async (req, res) => {
    try {
      const result = await findAdminEmailVerification(req.body)

      if (result?._id) {
        //TODO
        //information is valid now we can update the user
        const data = await verifyEmail(result.email)

        if (data?._id) {
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
        message:
          'Unable to verify your email. Either the link is invalid or expired.',
      })
    } catch (error) {
      res.json({
        status: 'error',
        message: 'Error, Unable to verify the email. Please try again later.',
      })
    }
  },
)

// user login
Router.post('/login', loginUserFormValidation, async (req, res) => {
  try {
    const { email, password } = req.body
    // console.log(req.body)
    const user = await getUserByEmail(email)
    console.log(user)
    if (user?._id && user?.role === 'admin') {
      //check if password is valid
      const isPasswordValid = comparePassword(password, user.password)
      if (isPasswordValid) {
        // get JWTs then send to client
        const jwts = await getJWTs({ _id: user._id, email: user.email })
        user.password = undefined

        return res.json({
          status: 'success',
          message: 'Login Success',
          jwts,
          user,
        })
      }
    }

    res.status(401).json({
      status: 'Error',
      message: 'Unauthorized',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Error, unable to Login, Please try again later.',
    })
  }
})

// user logout
Router.post('/logout', async (req, res) => {
  try {
    const { accessJWT, refreshJWT } = req.body
    accessJWT && (await removeSession(accessJWT))
    refreshJWT && (await removeRefreshJWT(refreshJWT))

    res.json({
      status: 'success',
      message: 'Logging out...',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Error, unable to Login, Please try again later.',
    })
  }
})

//update password when logged in
Router.post(
  '/password-update',
  isAdminUser,
  passwordUpdateFormValidation,
  async (req, res) => {
    try {
      const { _id, password, fname, email } = req.user
      const { currentPassword } = req.body
      //make sure the current password matches the onse in the database
      const passMatched = comparePassword(currentPassword, password)
      if (passMatched) {
        // if matched, then encrypt the new password and store in db
        const hashedPass = hashPassword(req.body.password)
        if (hashedPass) {
          //update user table
          const user = await updateUserProfile(_id, { password: hashedPass })
          if (user._id) {
            res.json({
              status: 'success',
              message: 'Password updated successfully',
            })
            // send email notification
            sendPasswordUpdateNotification({ fname, email })
            return
          }
        }
      }

      res.json({
        status: 'error',
        message: 'Unable to update password. Please try again later.',
      })
    } catch (error) {
      res.json({
        status: 'error',
        message: 'Error, unable to process your request.',
      })
    }
  },
)

//reset forgotten password when logged out
Router.post(
  '/reset-password',
  forgotPasswordResetFormValidation,
  async (req, res) => {
    try {
      const { otp, password, email } = req.body

      // validate if otp and email exists in db
      const filter = { pin: otp, email }
      const hasOtp = await findAdminEmailVerification(filter)

      if (hasOtp?._id) {
        // encrypt new pw coming from frontend
        const hashedPass = hashPassword(password)
        if (hashedPass) {
          //update user table with the new pw
          const user = await updateUserProfileByEmail(email, {
            password: hashedPass,
          })
          if (user._id) {
            res.json({
              status: 'success',
              message: 'Password updated successfully',
            })
            // send email notification
            sendPasswordUpdateNotification({ email })

            /// don't forget to delete the otp set from db
            deleteInfo(filter)

            return
          }
        }
      }

      res.json({
        status: 'error',
        message: 'Unable to update password. Please try again later.',
      })
    } catch (error) {
      res.json({
        status: 'error',
        message: 'Error, unable to process your request.',
      })
    }
  },
)

export default Router
