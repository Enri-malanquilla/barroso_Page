const getDB = require('./../../bdd/getBD');

const deleteUserAdmin = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { idUser } = req.params;
    const { id, name } = req.userAuth;
    //info usuarios
    const [userToDelete] = await connection.query(
      `
    SELECT role, access, deleted, name FROM user_dev
        WHERE id = ?
    `,
      [idUser]
    );
    const [userLogged] = await connection.query(
      `
        SELECT role, access FROM user_dev
        WHERE id = ? AND name = ?
        `,
      [id, name]
    );
    //comprobamos datos
    if (userLogged[0].role !== 'admin') {
      const error = new Error('No tienes autorización');
      error.httpStatus = 409;
      throw error;
    }
    if (userToDelete[0].deleted) {
      const error = new Error('El usuario ya está eliminado');
      error.httpStatus = 403;
      throw error;
    }
    if (id === +idUser || userToDelete[0].role === 'admin') {
      const error = new Error('Ponerse en contacto con programador');
      error.httpStatus = 403;
      throw error;
    }
    //cambiamos estado
    await connection.query(
      `
    UPDATE user_dev
    SET name = '[deleted]-${userToDelete[0].name}', active = 0, deleted = 1, security_question = "usuario eliminado"
    , key_word = "usuario eliminado" 
    WHERE id = ? AND name = ?
    `,
      [idUser, userToDelete[0].name]
    );

    res.send({
      status: 'ok',
      message: `Usuario ${userToDelete[0].name} eliminado `,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteUserAdmin;
