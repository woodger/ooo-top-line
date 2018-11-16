const mariadb = require('./asserts/maria-db');
const books = require('../statics/books-dataset');
const apptrc = require('../apptrc');

(async () => {
  const db = await mariadb.connect(apptrc.mariadb);

  await db.query(
    "CREATE DATABASE `example` CHARACTER SET utf8 COLLATE utf8_general_ci;"
  );

  await db.query("USE `example`;");

  await db.query(
    "CREATE TABLE `books` (" +
      "`id` INT (10) NOT NULL AUTO_INCREMENT," +
      "`title` CHAR (255) NOT NULL," +
      "`date` DATE NOT NULL," +
      "`autor` CHAR (255) NOT NULL," +
      "`description` TEXT NOT NULL," +
      "`image` CHAR (255) NOT NULL," +
      "PRIMARY KEY (`id`)" +
    ");"
  );

  for (let i = 0; i < 1e5; i++) {
    // return a random integer between 0 and books.length

    let index = Math.floor(Math.random() * books.length);
    let book = books[index];
    let {title, date, autor, description, image} = book;

    await db.query(
      "INSERT INTO `books`" +
      "(title, date, autor, description, image)" +
      "VALUES (?, ?, ?, ?, ?);", [
        title,
        date,
        autor,
        description,
        image
      ]
    );
  }
})();
