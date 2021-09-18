# SQLITE

Simple CRUD API to consume and fetch data which is sent from the Chef Automate "data feed" feature. [docs](https://docs.chef.io/automate/datafeed/)

* Built with sqlite3 backend for test purposes but uses Sequelize for database operations so would support any back-end which Sequelize works with.

## Local Development

### Requirements

* Node.JS
* sqlite3

### Initial Setup

* Clone project to local development location
* `cd` to project directory from terminal/shell and issue `npm install` command which will install all dependencies from `package.json`
* Create file `.env` in root of repository, using `.env.example` as reference
* `npm start` will launch local instance of Server using `nodemon` process, allowing for server restarts if missing.
* DB tables will be automatically created from Sequelize.  If using the `DB_INIT` parameter of `force` as recommended, the db will drop tables and rebuild on every save of a `.js` file in the path, allowing for fresh testing to be completed.
