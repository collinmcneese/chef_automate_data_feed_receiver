// data_feeds table
function strip_json_string(json) {
  // return json.replace(/\\/g, '').replace(/"{/, '{').replace(/}"/, '}');
  // cat client_run.json | sed 's/^"//' | sed 's/"$//' | sed 's/\\"/"/g' | sed 's/\\\\/\\/g' | jq
  json.replace(/^"/, '');
  json.replace(/"$/, '');
  json.replace(/\\"/g, '"');
  return json;
}

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('df_compliance_data_feed', {
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
    profile_name: {
      type: DataTypes.STRING,
    },
    profile_full: {
      type: DataTypes.STRING,
    },
    profile_status: {
      type: DataTypes.STRING,
    },
    profile_controls: {
      type: DataTypes.TEXT,
      get: function() {
        if (this.getDataValue('profile_controls')) {
          return JSON.parse(strip_json_string(this.getDataValue('profile_controls')));
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
  });
};
