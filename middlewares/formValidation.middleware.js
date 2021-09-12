import Joi from 'joi'

const shortstr = Joi.string().max(20).alphanum().required()
const email = Joi.string().max(50).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'au'] } }).required()

export const createAdminUserValidation = (req, res, next) => {

//server validation
const schema = Joi.object({
    fname: shortstr,
    lname: shortstr,
    gender: Joi.string().max(6),
    dob: Joi.date(),
    email: email,
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


export const adminnEmailVerificationValidation = (req, res, next) => {
    const schema = Joi.object({
        email: email,
        pin: Joi.string().min(6).required(),
    })
    
    const value = schema.validate(req.body)
    
        if(value.error){
            return res.json({
                status: 'error',
                message: value.error.message,
            })
        }
        next()
    
}