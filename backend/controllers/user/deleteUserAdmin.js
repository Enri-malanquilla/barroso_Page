const { nextDay } = require('date-fns');
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
    SELECT role, access, deleted FROM user_dev
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
    console.log(userLogged[0].role);
    //comprobamos datos
    if (userLogged[0].role !== 'admin') {
      const error = new Error('No tienes autorización');
      error.httpStatus = 409;
      throw error;
    }
    if (id === +idUser || userToDelete[0].role === 'admin') {
      const error = new Error('Ponerse en contacto con programador');
      error.httpStatus = 403;
      throw error;
    }
    if (userToDelete[0].deleted) {
      const error = new Error('El usuario ya está eliminado');
      error.httpStatus = 403;
      throw error;
    }
    //cambiamos estado

    res.send({
      status: 'ok',
      message: `Usuario tal eliminado `,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteUserAdmin;
