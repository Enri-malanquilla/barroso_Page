const getBD = require('../../bdd/getBD');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const { CRYPTO_PHRASE } = process.env;

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
      SELECT id, active, password, role, name, email FROM user_dev
      WHERE (email = ? AND password = SHA2(?, 512))
     
      `,
      [email, password]
    );
    if (user.length < 1) {
      const error = new Error('Email o contraseña incorrectos');
      error.httpStatus = 401;
      throw error;
    }
    if (!user[0].active) {
      const error = new Error('Usuario pendiente de validar o inactivo');
      error.httpStatus = 401;
      throw error;
    }
    if (user[0].deleted) {
      const error = new Error('Usuario eliminado, preguntar a admin');
      error.httpStatus = 401;
      throw error;
    }

    if (user[0].role === 'admin' && !keyword) {
      const error = new Error('Debes introducir la clave');
      error.httpStatus = 400;
      throw error;
    }
    if (user[0].role === 'admin') {
      const [key] = await connection.query(
        `
        SELECT name FROM user_dev
        WHERE key_word = SHA2(?, 512)
        `,
        [keyword]
      );
      if (key.length < 1) {
        const error = new Error('No eres administrador');
        error.httpStatus = 400;
        throw error;
      }
    }
    //encriptamos info de token
    const userCrypto = crypto.AES.encrypt(
      `${user[0].name}`,
      CRYPTO_PHRASE
    ).toString();
    const nameCrypto = crypto.AES.encrypt(
      `${user[0].id}`,
      CRYPTO_PHRASE
    ).toString();

    //creamos token
    const tokenInfo = {
      name: userCrypto,
      id: nameCrypto,
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
