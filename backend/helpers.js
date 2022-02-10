//validar datos, joi requerido en schema
async function validate(schema, data) {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    error.httpStatus = 400;
    throw error;
  }
}
//exportamos funciones
module.exports = {
  validate,
};
