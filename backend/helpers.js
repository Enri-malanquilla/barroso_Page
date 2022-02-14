const crypto = require('crypto-js');
require('dotenv').config();
const { CRYPTO_PHRASE } = process.env;

//validar datos, joi requerido en schema
async function validate(schema, data) {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    error.httpStatus = 400;
    throw error;
  }
}
//DESENCRIPTAR
const desencrypt = (data) => {
  const descryptStringify = crypto.AES.decrypt(data, CRYPTO_PHRASE);
  return descryptStringify.toString(crypto.enc.Utf8);
};
//exportamos funciones
module.exports = {
  validate,
  desencrypt,
};
