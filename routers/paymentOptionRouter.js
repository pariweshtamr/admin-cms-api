import express from 'express'
const Router = express.Router()

import {
  storePaymentOption,
  getAllPaymentOptions,
  removePaymentOption,
  updatePaymentOption,
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

Router.patch('/', async (req, res) => {
  try {
    const { _id, status } = req.body

    if (_id) {
      const result = await updatePaymentOption({ _id, status })

      if (result?._id) {
        return res.json({
          status: 'success',
          message: 'The payment option has been successfully updated',
          options: result,
        })
      }
    }

    res.json({
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

Router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params
    const result = await removePaymentOption(_id)

    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'The payment option has been successfully deleted',
        options: result,
      })
    }
    res.json({
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
