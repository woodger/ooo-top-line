const mariadb = require('mariadb');
const TypeEnforcement = require('type-enforcement');

const te = new TypeEnforcement({
  '#connect()': {
    host: String,
    port: Number,
    user: String,
    passwd: String
  }
});

module.exports = {
  async connect({host = '127.0.0.1', port = 3306, user, passwd}) {
    let err = te.validate('#connect()', {
      host,
      port,
      user,
      passwd
    });

    if (err) {
      throw err;
    }

    let pool = mariadb.createPool({
      host,
      port,
      user,
      password: passwd,
      connectionLimit: 5
    });

    let join = await pool.getConnection();

    return join;
  }
}
