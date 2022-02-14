//impotar controllers usuario
const createUserAdmin = require('./createUserAdmin');
const deleteUserAdmin = require('./deleteUserAdmin');
const loginUser = require('./loginUser');

//exportar controllers usuario

module.exports = {
  loginUser,
  createUserAdmin,
  deleteUserAdmin,
};
