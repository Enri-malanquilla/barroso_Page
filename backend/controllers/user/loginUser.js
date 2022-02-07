const getBD = require('../../bdd/getBD');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getBD();
    //formulario
    const { email, password, keyword } = req.body;
    if (!email || !password) {
      const error = new Error('Falta email o contraseña');
      error.httpStatus = 400;
      throw error;
    }
    //comprobacion de usuario
    const [user] = await connection.query(
      `
      SELECT id, active, role, name, key_word, active FROM user_dev
      WHERE email = ? AND password = SHA2(?,512) 
      `,
      [email, password]
    );
    if (user.length < 1) {
      const error = new Error('Email o contraseña incorrectos');
      error.httpStatus = 401;
      throw error;
    }
    if (user.role === 'admin' && !keyword) {
      const error = new Error('Debes introducir la clave');
      error.httpStatus = 400;
      throw error;
    }
    if (!user[0].active) {
      const error = new Error('Usuario pendiente de validar o inactivo');
      error.httpStatus = 401;
      throw error;
    }
    //creamos token
    const tokenInfo = {
      name: user[0].name,
      id: user[0].id,
    };
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: '30d',
    });
    res.send({
      status: 'ok',
      token,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = loginUser;
