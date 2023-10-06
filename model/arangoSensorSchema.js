const ignitor = require("ignitor");

module.exports = ignitor.Model("Sensor", {
  sensor_id: {
    type: String,
    required: true,
  },
  zone_id: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
  },
});
