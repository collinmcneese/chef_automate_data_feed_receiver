# PGSQL

Simple CRUD API to consume and fetch data which is sent from the Chef Automate "data feed" feature. [docs](https://docs.chef.io/automate/datafeed/)

* Built with PGSQL backend for test purposes but uses Sequelize for database operations so would support any back-end which Sequelize works with.
* Uses simple basic authentication for sandbox purposes:

    ```plain
    user: df
    pass: df
    ```

## Local Development

### Requirements

* Node.JS
* PGSQL DB instance

### Initial Setup

* Clone project to local development location
* `cd` to project directory from terminal/shell and issue `npm install` command which will install all dependencies from `package.json`
* Create file `.env` in root of repository, using `.env.example` as reference
* Launch PGSQL DB instance and update location and credential information in `.env` file.

    ```sh
    # sample .env file for local development
    # default to false
    #  true: will create DB objects
    #  force: will create DB objects and drop all existing data
    DB_INIT=false
    # Name of the database
    DB_NAME=datafeed_dev
    # Database server host
    DB_HOST=localhost
    # Database username and password for authentication
    DB_USER=sa
    DB_PASSWORD=P@55w0rd
    # Optional domain name for the database user
    DB_DOMAIN=
    # Optional database instance name to connect to
    DB_INSTANCE=
    # Local IP to bind to.  Use system name, specific IP, 0.0.0.0 or localhost
    API_BIND_IP=localhost
    # local port to bind to
    API_BIND_PORT=3000
    # external host to expose to use if behind a proxy/load-balancer
    API_EXTERNAL_HOST=
    # external port to expose to use if behind a proxy/load-balancer
    API_EXTERNAL_PORT=
    ```

* Connect to PGSQL DB instance and create the database named in the `.env` file, if not present, along with associated credentials.
* `npm start` will launch local instance of Server using `nodemon` process, allowing for server restarts if missing.
* DB tables will be automatically created from Sequelize.  If using the `DB_INIT` parameter of `force` as recommended, the db will drop tables and rebuild on every save of a `.js` file in the path, allowing for fresh testing to be completed.
