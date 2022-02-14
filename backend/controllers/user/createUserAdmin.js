const getDB = require('../../bdd/getBD');

const { validate } = require('../../helpers');

const newUserSchemaAdmin = require('../../schema/newUserSchemaAdmin');

const createUserAdmin = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { id, name } = req.userAuth;
    console.log(id, name);
    const [admin] = await connection.query(
      `
      SELECT role FROM user_dev
      WHERE id = ? AND name = ?
      `,
      [id, name]
    );
    if (admin.length < 1 || admin[0].role !== 'admin') {
      const error = new Error('No tienes permisos');
      error.httpStatus = 409;
      throw error;
    }
    //validamos datos
    await validate(newUserSchemaAdmin, req.body);
    const { email, password, user_name, role, access, question_key, key_word } =
      req.body;
    const [emailValidationRepeat] = await connection.query(
      `
    SELECT id, active, email, name, deleted FROM user_dev WHERE email= ? OR name= ?
    `,
      [email, user_name]
    );
    if (emailValidationRepeat.length > 0) {
      for (const item of emailValidationRepeat) {
        if (item.email === email) {
          const error = new Error('email ya existe en sistema');
          error.httpStatus = 409;
          throw error;
        }
        if (item.name === user_name) {
          const error = new Error('Nombre de usuario ya existe en sistema');
          error.httpStatus = 409;
          throw error;
        }
        if (item.deleted === true) {
          const error = new Error(
            'Usuario registrado en base de datos como eliminado, modifica el perfil.'
          );
          error.httpStatus = 409;
          throw error;
        }
      }
    }
    //insertamos datos
    await connection.query(
      `
    INSERT INTO user_dev (email, password, name, role, access, security_question, key_word, created_user)
    VALUES (?, SHA2(?, 512), ?, ?, ?, ?, SHA2(?, 512), ?)
    `,
      [
        email,
        password,
        user_name,
        role,
        access,
        question_key,
        key_word,
        new Date(),
      ]
    );

    res.send({
      status: 'ok',
      message: `Usuario registrado como ${user_name}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = createUserAdmin;
