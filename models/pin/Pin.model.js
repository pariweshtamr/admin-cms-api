import PinSchema from './Pin.schema.js'
import { randomNumberGenerator } from '../../utils/randomGenerator.js'
// to create a unique email validation info

const pinLength = 6
export const createUniqueEmailConfirmation = async (email) => {
  try {
    // generate random 6 digit numbers
    const pin = randomNumberGenerator(pinLength)

    if (!pin || !email) {
      return false
    }

    const newEmailValidation = {
      pin,
      email,
    }

    const result = await PinSchema(newEmailValidation).save()
    console.log(result)
    return result

    // store pin with email in Pin table
  } catch (error) {
    throw new Error(error)
  }
}

export const findAdminEmailVerification = async (filterObj) => {
  try {
    const result = await PinSchema.findOne(filterObj)
    return result

    // store pin with email in Pin table
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteInfo = async (filterObj) => {
  try {
    const result = await PinSchema.findOneAndDelete(filterObj)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const createUniqueOTP = async ({ email, type }) => {
  try {
    // generate random 6 digit numbers
    const pin = randomNumberGenerator(pinLength)

    if (!pin || !email) {
      return false
    }

    const newOtp = {
      pin,
      email,
      type,
    }

    const result = await PinSchema(newOtp).save()
    return result

    // store pin with email in Pin table
  } catch (error) {
    throw new Error(error)
  }
}
