const Koa = require('koa');
const mariadb = require('./app/asserts/maria-db');
const router = require('./app/router');
const apptrc = require('./apptrc');

(async () => {
  const app = new Koa();
  const db = await mariadb.connect(apptrc.mariadb);

  await db.query("use `example`;");
  app.context.db = db;

  app.use(router.routes());
  app.listen(apptrc.server.port);
})();
