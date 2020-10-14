// data_feeds table
function strip_json_string(json) {
  return json.replace(/\\/g, '').replace(/"{/, '{').replace(/}"/, '}');
}
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('df_data_feed', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    platform: {
      type: DataTypes.STRING,
    },
    attributes_automatic: {
      type: DataTypes.TEXT,
      get: function() {
        return JSON.parse(strip_json_string(this.getDataValue('attributes_automatic')));
      },
    },
    attributes_normal: {
      type: DataTypes.TEXT,
      get: function() {
        return JSON.parse(strip_json_string(this.getDataValue('attributes_normal')));
      },
    },
    attributes_default: {
      type: DataTypes.TEXT,
      get: function() {
        return JSON.parse(strip_json_string(this.getDataValue('attributes_default')));
      },
    },
    client_run: {
      type: DataTypes.TEXT,
    },
    node_id: {
      type: DataTypes.STRING,
    },
  });
};
