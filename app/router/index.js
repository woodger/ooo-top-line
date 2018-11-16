const Router = require('koa-router');
const books = require('../models/books');

const router = new Router();

router
  .post('/books', async (ctx, next) => {})
  .get('/books', async (ctx, next) => {})
  .put('/books', async (ctx, next) => {});

module.exports = router;
