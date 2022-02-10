//impotar controllers usuario
const createUserAdmin = require('./createUserAdmin');
const loginUser = require('./loginUser');

//exportar controllers usuario

module.exports = {
  loginUser,
  createUserAdmin,
};
