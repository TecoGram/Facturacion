const dbFile = process.env.NODE_ENV === "test" ? "/test.sqlite": "/mydb.sqlite"

module.exports = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: __dirname + dbFile,
  },
  acquireConnectionTimeout: 10000,
});
