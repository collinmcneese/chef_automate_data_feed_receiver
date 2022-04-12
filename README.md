# automate-data-feed-receiver

![Status](https://github.com/collinmcneese/automate-data-feed-receiver/actions/workflows/validation.yml/badge.svg)

Simple CRUD API to consume and fetch data which is sent from the Chef Automate "data feed" feature. [docs](https://docs.chef.io/automate/datafeed/)

DB Backend configuration options available for:

* [MSSQL](mssql/README.md)
* [SQLITE](sqlite/README.md)
* [PostgreSQL](pgsql/README.md)

```toml
# Example toml configuration to patch for Chef Automate
#  for running the data-feed service at a very aggressive 1-minute interval
# Save as datafeed.toml file on Chef Automate server and load with:
#  chef-automate config patch /path/to/datafeed.toml

[data_feed_service.v1.sys]
[data_feed_service.v1.sys.service]
  feed_interval = "1m"
  node_batch_size = 30
  updated_nodes_only = true
  disable_cidr_filter = true
  cidr_filter = "0.0.0.0/0"
  accepted_status_codes = [200, 201, 202, 203, 204]
[data_feed_service.v1.sys.log]
  level = "info"

```
