const mariadb = require('mariadb');
const TypeEnforcement = require('type-enforcement');

// https://github.com/woodger/type-enforcement#constructor-new-typeenforcementshema
const te = new TypeEnforcement({
  '#connect()': {
    host: String,
    port: Number,
    user: String,
    passwd: String,
    db: String
  }
});

module.exports = {
  connect({host = '127.0.0.1', port = 3306, user, passwd, db}) {

    // https://github.com/woodger/type-enforcement#tevalidateorder-doc-options
    let err = te.validate('#connect()', {
      host,
      port,
      user,
      passwd,
      db
    });

    if (err) {
      throw err;
    }

    // https://mariadb.com/kb/en/library/getting-started-with-the-nodejs-connector/
    return mariadb.createPool({
      host,
      port,
      user,
      password: passwd,
      database: db,
      connectionLimit: 5
    });
  }
}
