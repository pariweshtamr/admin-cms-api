import PaymentOptionsSchema from './PaymentOptions.schema.js'

export const storePaymentOption = (paymentObj) => {
  return PaymentOptionsSchema(paymentObj).save()
}

export const getAllPaymentOptions = () => {
  return PaymentOptionsSchema.find()
}

export const getAPaymentOption = (_id) => {
  return PaymentOptionsSchema.findById(_id)
}

export const removePaymentOption = (_id) => {
  return PaymentOptionsSchema.findByIdAndRemove(_id)
}
