import Joi from 'joi'

export const createAdminUserValidation = (req, res, next) => {

//server validation
const schema = Joi.object({
    fname: Joi.string().max(20).alphanum().required(),
    lname: Joi.string().max(20).alphanum().required(),
    gender: Joi.string().max(6),
    dob: Joi.date(),
    email: Joi.string().max(50).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'au'] } }).required(),
    phone: Joi.string().max(15),
    address: Joi.string().max(100),
    password: Joi.string().min(7).alphanum().required(),
})

const value = schema.validate(req.body)
    console.log(value)

    if(value.error){
        return res.json({
            status: 'error',
            message: value.error.message,
        })
    }
    next()
}