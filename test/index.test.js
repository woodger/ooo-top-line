const fs = require('fs');
const assert = require('assert');
const http = require('http');
const streamToString = require('stream-to-string')
const FormData = require('form-data');
const config = require('../config.json');
const app = require('..');



describe(`API test server`, () => {
  const {port} = config.server;
  const cwd = process.cwd();

  after(async () => {
    let {server, context} = await app;

    await context.db.close();
    await context.db.pool.end();

    server.close();
  });

  it(`<GET> By default, the book list should return 30 entries`, (done) => {
    http.get(`http://127.0.0.1:${port}/books`, (res) => {
      streamToString(res).then((body) => {
        let list = JSON.parse(body);

        if (list.length === 30) {
          done();
        }
      });
    });
  });

  it(`<GET> Must return as many records as specified`, (done) => {
    http.get(`http://127.0.0.1:${port}/books?limit=1`, (res) => {
      streamToString(res).then((body) => {
        let list = JSON.parse(body);

        if (list.length === 1) {
          done();
        }
      });
    });
  });

  it(`<GET> Must return record by the selected field`, (done) => {
    http.get(`http://127.0.0.1:${port}/books?title=%D0%92%D0%B8%D0%B9`, (res) => {
      streamToString(res).then((body) => {
        let [first] = JSON.parse(body);

        if (first.title === 'Вий') {
          done();
        }
      });
    });
  });

  it(`<POST> The server must add entries`, (done) => {
    let form = new FormData();

    form.append('title', 'Дочь Монтесумы');
    form.append('date', '2013-11-23');
    form.append('author', 'Генри Райдер Хаггард');
    form.append('description', 'История о жизни Томаса Вингфилда');
    form.append('image', fs.createReadStream(
       `${cwd}/statics/images/books/125046-genri-haggard-doch-montesumy.jpg`
    ));

    let options = {
      host: '127.0.0.1',
      port,
      path: '/books',
      method: 'POST',
      headers: form.getHeaders()
    };

    let req = http.request(options, (res) => {
      streamToString(res).then((body) => {
        let {insert_id} = JSON.parse(body);

        if (insert_id > 0) {
          done();
        }
      });
    });

    form.pipe(req);
  });

  it(`<PUT> The server must update entries by index`, (done) => {
    let form = new FormData();

    form.append('title', 'Дочь Монтесумы');
    form.append('date', '2013-11-23');
    form.append('author', 'Генри Райдер Хаггард');
    form.append('description', 'История о жизни Томаса Вингфилда');
    form.append('image', fs.createReadStream(
       `${cwd}/statics/images/books/125046-genri-haggard-doch-montesumy.jpg`
    ));

    let options = {
      host: '127.0.0.1',
      port,
      path: '/books/1',
      method: 'PUT',
      headers: form.getHeaders()
    };

    let req = http.request(options, (res) => {
      streamToString(res).then((body) => {
        let {affected_rows} = JSON.parse(body);

        if (affected_rows === 1) {
          done();
        }
      });
    });

    form.pipe(req);
  });
});
