const Router = require('koa-router');
const koaBody = require('koa-body');
const books = require('./books');

const router = new Router();

router
  .post('/books', koaBody({ multipart: true }), async (ctx) => {
    let id = await books.create(ctx);

    if (id === null) {
      ctx.status = 204;
    }
    else {
      ctx.status = 201;
      ctx.body = {
        insert_id: id
      };
    }
  })

  .get('/books', async (ctx) => {
    let list = await books.get(ctx);

    if (list.length === 0) {
      ctx.status = 204;
    }
    else {
      ctx.body = list;
    }
  })

  .put('/books/:id', koaBody({ multipart: true }), async (ctx) => {
    let rows = await books.update(ctx);

    if (rows === null) {
      ctx.status = 204;
    }

    ctx.status = 202;
    ctx.body = rows;

    ctx.body = {
      affected_rows: rows
    };
  });

module.exports = router;
