import Joi from "joi";

const fillSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    "string.empty": "first name is required"
  }),
  lastName: Joi.string().trim().required().messages({
    "string.empty": "last name is required"
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.email": "Must be a valid email"
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Must be a phone number"
    })
});

const validateFill = input => {
  const { error } = fillSchema.validate(input, { abortEarly: false });
  if (error) {
    const result = error.details.reduce((acc, el) => {
      acc[el.path[0]] = el.message;
      return acc;
    }, {});
    return result;
  } else {
    return {};
  }
};

export default validateFill;
