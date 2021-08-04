# PostgreSQL

Simple CRUD API to consume and fetch data which is sent from the Chef Automate "data feed" feature. [docs](https://docs.chef.io/automate/datafeed/)

* Built with MSSQL backend for test purposes but uses Sequelize for database operations so would support any back-end which Sequelize works with.
* Uses simple basic authentication for sandbox purposes:

    ```plain
    user: df
    pass: df
    ```

## Local Development
