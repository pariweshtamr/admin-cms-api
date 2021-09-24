import Joi from "joi";

const shortstr = Joi.string().max(30).alphanum().required();
const plainShortStr = Joi.string().max(20).required();
const id = Joi.string().max(30);
const email = Joi.string()
  .max(50)
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "au"] } })
  .required();
const shortStrNull = Joi.string().max(30).allow(null).allow("");

export const createAdminUserValidation = (req, res, next) => {
  //server validation
  const schema = Joi.object({
    fname: shortstr,
    lname: shortstr,
    gender: Joi.string().max(6).allow(""),
    dob: Joi.date().allow(null).allow(""),
    email: email,
    phone: Joi.string().max(15),
    address: Joi.string().max(100),
    password: Joi.string().min(7).max(30).required(),
  });

  const value = schema.validate(req.body);
  console.log(value);

  if (value.error) {
    return res.json({
      status: "error",
      message: value.error.message,
    });
  }
  next();
};

export const adminnEmailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: email,
    pin: Joi.string().min(6).required(),
  });

  const value = schema.validate(req.body);

  if (value.error) {
    return res.json({
      status: "error",
      message: value.error.message,
    });
  }
  next();
};

export const newCategoryValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      name: plainShortStr,
      parentCat: shortStrNull,
    });
    const value = schema.validate(req.body);

    if (value.error) {
      return res.json({
        status: "error",
        message: value.error.message,
      });
    }
    next();
  } catch (error) {
    res.json({
      status: "error",
      message: value.error.message,
    });
  }
};

export const updateCategoryValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      _id: id,
      name: plainShortStr,
      parentCat: shortStrNull,
    });
    const value = schema.validate(req.body);

    if (value.error) {
      return res.json({
        status: "error",
        message: value.error.message,
      });
    }
    next();
  } catch (error) {
    res.json({
      status: "error",
      message: value.error.message,
    });
  }
};

export const loginUserFormValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: email,
      password: Joi.string().min(7).max(30).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({
        status: "error",
        message: error.message,
      });
    }
    next();
  } catch (error) {
    res.json({
      status: "error",
      message: "Error, Unable to process your request. Please try again later.",
    });
  }
};
