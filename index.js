const Koa = require('koa');
const mariadb = require('./app/asserts/maria-db');
const router = require('./app/router');
const config = require('./config');

const server = async () => {
  let app = new Koa();

  let server = app.listen(config.server.port);
  let db = await mariadb.connect(config.mariadb);

  app.context.db = db;
  app.server = server;

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};


module.exports = server();
