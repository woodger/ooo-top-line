const path = require('path');
const FileSystem = require('pwd-fs');

// https://github.com/woodger/pwd-fs#constructor-new-filesystempath
const pfs = new FileSystem();

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
const imageMimeTypes = [
  'image/gif',
  'image/png',
  'image/jpeg',
  'image/bmp',
  'image/webp',
  'image/svg+xml'
];

let fieldsOfBookTable = ['title', 'date', 'author', 'description', 'image'];

const criteria = {
  parse(ctx) {
    let fields = {};
    let range = [0, 30];
    let sort = '';

    for (let i in ctx.query) {
      let prop = ctx.query[i];

      if (fieldsOfBookTable.includes(i)) {
        fields[i] = prop;
      }
      else if (i === 'limit') {
        range = prop.split(',').map(i => {
          return Number(i.trim());
        });
      }
      else if (i === 'sort') {
        sort = prop;
      }
    }

    return {
      fields,
      range,
      sort
    };
  },

  async upload(ctx) {
    let {title, date, author, description} = ctx.request.body;

    let empty = [
      title,
      date,
      author,
      description
    ].some(i => {
      return i === undefined || i === '';
    });

    if (empty) {
      return null;
    }

    let {image} = ctx.request.files;

    if (image === undefined || imageMimeTypes.includes(image.type) === false) {
      return null;
    }

    await pfs.copy(image.path, 'statics/images/books');

    let base = path.basename(image.path);
    let dest = 'statics/images/books/' + image.name;

    await pfs.rename(
      'statics/images/books/' + base,
      dest
    );

    return {
      title,
      date,
      author,
      description,
      image: dest
    };
  }
};

const books = {
  async create(ctx) {
    let dataset = await criteria.upload(ctx);

    if (dataset === null) {
      return null;
    }

    let {title, date, author, description, image} = dataset;

    let affect = await ctx.db.query(
      "INSERT INTO `books`" +
      "(`title`, `date`, `author`, `description`, `image`)" +
      "VALUES (?, ?, ?, ?, ?);", [
        title,
        date,
        author,
        description,
        image
      ]
    );

    return affect.insertId;
  },

  async get(ctx) {
    let {fields, sort, range} = criteria.parse(ctx);
    let where = '';

    for (let i of Object.keys(fields)) {
      let prop = fields[i];

      let operator = where === '' ?
        " WHERE " : " AND ";

      where += operator + "`" + i + "`='" + prop + "'";
    }

    let order = '';

    if (sort !== '') {
      order = " ORDER BY `" + sort + "`";
    }

    let limit = " LIMIT " + range.join(',');

    // https://mariadb.com/kb/en/library/connectornodejs-promise-api/
    let list = await ctx.db.query(
      "SELECT * from `books`" + where + order + limit + ";"
    );

    return list;
  },

  async update(ctx) {
    let dataset = await criteria.upload(ctx);

    if (dataset === null) {
      return null;
    }

    let {title, date, author, description, image} = dataset;

    let affect = await ctx.db.query(
      "UPDATE `books` " +
      "SET `title`=?, `date`=?, `author`=?, `description`=?, `image`=? " +
      "WHERE `id`=?;", [
        title,
        date,
        author,
        description,
        image,
        ctx.params.id
      ]
    );

    return affect.affectedRows;
  }
}

module.exports = books;
