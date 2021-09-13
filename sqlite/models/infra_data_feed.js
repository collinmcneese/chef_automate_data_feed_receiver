// data_feed_infra table
function strip_json_string(json) {
  json.replace(/^"/, '');
  json.replace(/"$/, '');
  json.replace(/\\"/g, '"');
  return json;
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('df_infra_data_feed', {
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
      // get: function() {
      //   if (this.getDataValue('attributes_automatic')) {
      //     return JSON.parse(strip_json_string(this.getDataValue('attributes_automatic')));
      //   }
      // },
    },
    attributes_normal: {
      type: DataTypes.TEXT,
      get: function() {
        if (this.getDataValue('attributes_normal')) {
          return JSON.parse(strip_json_string(this.getDataValue('attributes_normal')));
        }
      },
    },
    attributes_default: {
      type: DataTypes.TEXT,
      get: function() {
        if (this.getDataValue('attributes_default')) {
          return JSON.parse(strip_json_string(this.getDataValue('attributes_default')));
        }
      },
    },
    client_run: {
      type: DataTypes.TEXT,
      get: function() {
        if (this.getDataValue('client_run')) {
          return JSON.parse(strip_json_string(this.getDataValue('client_run')));
        }
      },
    },
    report: {
      type: DataTypes.TEXT,
      get: function() {
        if (this.getDataValue('report')) {
          return JSON.parse(strip_json_string(this.getDataValue('report')));
        }
      },
    },
    node_id: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['node_id'],
      },
      {
        unique: false,
        fields: ['name'],
      },
    ],
  });
};
