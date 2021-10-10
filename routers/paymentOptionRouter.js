import express from 'express'
const Router = express.Router()

import {
  storePaymentOption,
  getAllPaymentOptions,
} from '../models/payment-options/PaymentOptions.model.js'
import { newPaymentOptionValidation } from '../middlewares/paymentValidation.middleware.js'

Router.get('/', async (req, res) => {
  try {
    const result = await getAllPaymentOptions()
    res.json({
      status: 'success',
      message: 'Here are the payment methods ',
      options: result,
    })
  } catch (error) {
    return res.json({
      status: 'error',
      message: 'Unable to process your request. Please try again later',
    })
  }
})

Router.post('/', newPaymentOptionValidation, async (req, res) => {
  try {
    const result = await storePaymentOption(req.body)

    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'New payment option added successfully',
      })
    }
    return res.json({
      status: 'error',
      message: 'Unable to process your request. Please try again later',
    })
  } catch (error) {
    return res.json({
      status: 'error',
      message: 'Unable to process your request. Please try again later',
    })
  }
})

export default Router
