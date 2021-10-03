import Joi from 'joi'

const longstr = Joi.string().max(3000)
const plainShortStr = Joi.string().max(20).required()
const id = Joi.string().max(30)
const shortStrNull = Joi.string().max(50).allow(null).allow('')
const number = Joi.number()
const title = Joi.string().max(100).required()
const price = Joi.number().max(10000)
const date = Joi.date()
const qty = Joi.number().max(10000)

export const newProductValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      status: Joi.boolean(),
      title,
      price: price.required(),
      salesPrice: price,
      salesStartDate: date.allow('').allow(null),
      salesEndDate: date.allow('').allow(null),
      brand: shortStrNull,
      qty: qty.required(),
      description: longstr.required(),
      category: Joi.array(),
    })
    console.log(req.body)
    const values = schema.validate(req.body)

    if (values.error) {
      return res.json({
        status: 'error',
        message: values.error.message,
      })
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}
