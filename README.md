# Тестовое задание для Node.js:

Реализовать http-server на базе фреймворка `Koa2`, соответствующий следующим требованиям:

- Работает с базой данных `mysql`. В субд есть табличка books(1e5 записей, забить самостоятельно случайно, у каждой книги должны быть поля `title`, `date`, `author`, `description`, `image`). Реализация смежных табличек на усмотрение кандидата, архитектурные решения оцениваются. Работает на чистом SQL

- Присутствуют три контроллера:
  -  Добавляет записи в субд
  -  Отдает. Сделать возможность сортировки|группировки по всем возможным полям, возможность порционного получения с оффсетом
  > приветствуются варианты кэширования

  -  Изменяет

## Http-сервер API Koa2 REST

[![Build Status](https://travis-ci.com/woodger/ooo-top-line.svg?branch=master)](https://travis-ci.com/woodger/ooo-top-line)
[![Coverage Status](https://coveralls.io/repos/github/woodger/ooo-top-line/badge.svg?branch=master)](https://coveralls.io/github/woodger/ooo-top-line?branch=master)

Сервер предоставляет публичное API для обмена информацией о книгах. API позволяет получить список книг со следующими полями `title`, `date`, `author`, `description`, `image`.

Запрос для получения списка книг выглядит так:

```
http://127.0.0.1:3000/books
```

Возвращаемое значение: [JavaScript (JSON)](https://www.json.org).
По умолчанию, размер партии `<=30`.

Пример ответа:

```JSON
[{
  "id": 1,
  "title": "Дочь Монтесумы",
  "date": "2013-11-22T20:00:00.000Z",
  "author": "Генри Райдер Хаггард",
  "description": "История о жизни Томаса Вингфилда",
  "image": "statics/images/books/125046-genri-haggard-doch-montesumy.jpg"
}, {
  "id": 2,
  "title": "Робинзон Крузо",
  "date": "2010-02-08T21:00:00.000Z",
  "author": "Даниэль Дефо",
  "description": "История жизни Робинзона на необитаемом острове – повествование о мужественном и находчивом человеке, который сумел выжить и не одичать благодаря своему сильному духу и трудолюбию.",
  "image": "images/books/136433-daniel-defo-robinzon-kruzo-136433.jpg"
}]
```

### Запуск сервера

Для запуска `Http-сервер API Koa2 REST` потребуется пользователь СУБД [MariaDB](https://mariadb.com/). Параметры для подключения приложения к базе данных находятся в файле [config.json](https://github.com/woodger/ooo-top-line/blob/master/config.json).

После клонирования репозитория перейдите в директорию проекта и в терминале ввидите:

```bash
npm i && npm run init
```

Старт сервера, по умолчанию прослушивает `localhost`, порт `3000`

```bash
npm start
```

### Получение списка книг

В запросе могут быть указаны следующие параметры:

- `title=` **GET** Название книги, например: Гоголь Н.В. - `Вий`

```
http://127.0.0.1:3000/books?title=%D0%92%D0%B8%D0%B9
```

Литералы, допустимые для передачи в `URL` запрос перечислены в стандарте [RFC 6265](https://tools.ietf.org/html/rfc6265.html) 4.1.1. Syntax. Используйте [encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) - метод, кодирующий компонент универсального идентификатора ресурса `URL`.

- `date=` **GET** Дата опубликования, в формате `гггг-мм-дд`

```
http://127.0.0.1:3000/books?date=2014-03-23
```

- `author=` **GET** Автор. Следующий запрос выведет список книг у автора `Антон Чехов`

```
http://127.0.0.1:3000/books?author=%D0%90%D0%BD%D1%82%D0%BE%D0%BD%20%D0%A7%D0%B5%D1%85%D0%BE%D0%B2
```

- `description=` **GET** Описание.

- `image=` **GET** Изображение книги.

`description` и `image` работает аналогично функции `author`.

Сервер позволяет выбрать книги, используя комбинацию из нескольких параметров.

```
http://127.0.0.1:3000/books?author=%D0%90%D0%BD%D1%82%D0%BE%D0%BD%20%D0%A7%D0%B5%D1%85%D0%BE%D0%B2&date=2014-03-23
```

- `sort=` **GET** Сортировка по любому параметру: `title`, `date`, `author`, `description`, `image`.

Пример сортировки по `date`:

```
http://127.0.0.1:3000/books?sort=date
```

- `limit=[:skip,]:limit` **GET** Изменения размера партии, **По умолчанию** <=30. Если, через запятую указано значение параметра `:skip`, то будут выведены строки начиная с `:skip`.

```
http://127.0.0.1:3000/books?limit=5,10
```

### Добавление книги

Сервер API позволяет добавлять запись. Требуется передача данныч методом **POST** `http://127.0.0.1:3000/books`. Все поля являются обязательными для передачи.

- `title`, `date`, `author`, `description`. Строковый тип `utf8`.

- `image` Ресурс. Допустимы типы:
  - image/gif
  - image/png
  - image/jpeg
  - image/bmp
  - image/webp
  - image/svg+xml

Возвращаемое значение `{insert_id: id}` [JavaScript (JSON)](https://www.json.org). `id` <[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)> Идентификатор добавленной книги.

### Изменение книги

Сервер API позволяет Изменять запись. Требуется передача данныч методом **PUT** `http://127.0.0.1:3000/books/<id>`. Все поля являются обязательными для передачи.

- `title`, `date`, `author`, `description`. Строковый тип `utf8`.

- `image` Ресурс. Допустимые типы:
  - image/gif
  - image/png
  - image/jpeg
  - image/bmp
  - image/webp
  - image/svg+xml

Возвращаемое значение `{affected_rows: number}` [JavaScript (JSON)](https://www.json.org). `affected_rows` <[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)> указывает количество изменненых записей.

## Второй вариант решения

Использовать готовое решение [KoA REST API Boilerplate](https://github.com/posquit0/koa-rest-api-boilerplate)

Это решение включает следующие функции:

- Управление журналом с помощью `Bunyan`.
- Минималистичный и оптимизированный снимок `Docker`.
- Документация `Swagger API` на основе `JSDoc`.
- Непрерывная интеграция и развертывание с использованием `CircleCI`.
- `unit` тесты и интеграция с уровнем покрытия кода с использованием инфраструктуры тестирования `Jest`.

Предполагает интеграцию с базой данных и построение контроллера.
