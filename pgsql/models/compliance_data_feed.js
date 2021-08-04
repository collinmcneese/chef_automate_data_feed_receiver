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
    control_name: {
      type: DataTypes.STRING,
    },
    control_title: {
      type: DataTypes.STRING,
    },
    control_waived: {
      type: DataTypes.STRING,
    },
    control_results: {
      type: DataTypes.TEXT,
      get: function() {
        if (this.getDataValue('control_results')) {
          return JSON.parse(strip_json_string(this.getDataValue('control_results')));
        }
      },
    },
    node_id: {
      type: DataTypes.STRING,
    },
  });
};
