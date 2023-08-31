import * as Joi from 'joi';

export function validateCreateUser(user){
    const Schema = Joi.object().keys({
        firstName: Joi.string().label("First Name").required(),
        lastName: Joi.string().label("Last Name").required(),
        email: Joi.string().label("Email").required(),
        password: Joi.string().label("Password").required(),
        confirmPassword: Joi.string().label("Confirm Password").required(),
        phone: Joi.string().label("Phone")
    })
    return Schema.validate(user);
}

export function validateChangePassword(password) {
    const Schema = Joi.object().keys({
      password: Joi.string().label('Password').required(),
      confirmPassword: Joi.string().label('Confirm Password').required()
    });

  return Schema.validate(password);

}

export function validateEditUser(user){
    const Schema = Joi.object().keys({
        firstName: Joi.string().label("First Name"),
        lastName: Joi.string().label("Last Name"),
        phone: Joi.string().label("Phone")
    })
    return Schema.validate(user);
}