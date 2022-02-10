const { access } = require('fs-extra');
const joi = require('joi');

const newUserSchemaAdmin = joi.object().keys({
  email: joi
    .string()
    .required()
    .email()
    .error((errors) => {
      return new Error('Debes introducir un email');
    }),
  password: joi
    .string()
    .required()
    .min(8)
    .max(20)
    .error((errors) => {
      if (
        errors[0].code === 'any.required' ||
        errors[0].code === 'string.empty'
      ) {
        return new Error('Se requiere contraseña');
      }
      return new Error('La contraseña debe constar entre 8 y 20 caracteres');
    }),
  user_name: joi
    .string()
    .required()
    .error((errors) => {
      if (
        errors[0].code === 'any.required' ||
        errors[0].code === 'string.empty'
      ) {
        return new Error('Se requiere nombre de usuario');
      }
      return new Error('Se requiere nombre de usuario');
    }),
  role: joi
    .string()
    .required()
    .error((error) => {
      return new Error('Elige el rol de usuario');
    }),
  access: joi
    .string()
    .required()
    .error((error) => {
      if (error[0].code === 'any.required')
        new Error('Elige el acceso de usuario');
    }),
  question_key: joi
    .string()
    .required()
    .error((errors) => {
      if (
        errors[0].code === 'any.required' ||
        errors[0].code === 'string.empty'
      ) {
        return new Error('Se requiere pregunta de seguridad');
      }
      return new Error('Se requiere pregunta de seguridad');
    }),
  key_word: joi
    .string()
    .required()
    .error((errors) => {
      if (
        errors[0].code === 'any.required' ||
        errors[0].code === 'string.empty'
      ) {
        return new Error('Se requiere palabra clave');
      }
      return new Error('Se requiere palabra clave');
    }),
});

module.exports = newUserSchemaAdmin;
