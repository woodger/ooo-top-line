const mariadb = require('./asserts/maria-db');
const dataset = require('../statics/books-dataset');
const config = require('../config');

(async () => {
  const db = await mariadb.connect(config.mariadb);

  await db.query(
    "CREATE TABLE IF NOT EXISTS `books` (" +
      "`id` INT UNSIGNED AUTO_INCREMENT," +
      "`title` TEXT NOT NULL," +
      "`date` DATE NOT NULL," +
      "`author` TEXT NOT NULL," +
      "`description` TEXT NOT NULL," +
      "`image` TEXT NOT NULL," +
      "PRIMARY KEY (`id`)" +
    ");"
  );

  let [count] = await db.query("SELECT COUNT(`id`) FROM `books`");

  if (count['COUNT(`id`)'] > 0) {
    return;
  }

  for (let i = 0; i < 1e2; i++) {
    // return a random integer between 0 and books.length

    let index = Math.floor(Math.random() * dataset.length);
    let book = dataset[index];
    let {title, date, author, description, image} = book;

    await db.query(
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
  }
})();
