const Joi = require("joi")

let signupSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  Cpassword: Joi.ref("password"),

  fname: Joi.string().alphanum().min(3).max(30).required(),

  lname: Joi.string().min(3).max(30).required(),
});

let loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

let forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

});

let createPasswordSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  Cpassword: Joi.ref("password"),

  token: Joi.required(),
});


module.exports = { signupSchema, loginSchema, forgotPasswordSchema ,createPasswordSchema};