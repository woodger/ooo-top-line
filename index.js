const Koa = require('koa');
const mariadb = require('./app/asserts/maria-db');
const router = require('./app/router');
const config = require('./config');

const server = async () => {
  let app = new Koa();

  let server = app.listen(config.server.port);
  let pool = mariadb.connect(config.mariadb);

  app.context.db = await pool.getConnection();

  app.use(router.routes());
  app.use(router.allowedMethods());

  return {
    pool,
    server,
    app
  };
};


module.exports = server();
