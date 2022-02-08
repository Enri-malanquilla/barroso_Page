const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
  try {
    //cabecera autorizacion
    const { authorization } = req.headers;
    if (!authorization) {
      const error = new Error('No tienes authorization');
      error.httpStatus = 401;
      throw error;
    }
    //desencriptamos token
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (_) {
      const error = new Error('El token no es válido');
      error.httpStatus = 401;
      throw error;
    }
    req.userAuth = tokenInfo;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authUser;
