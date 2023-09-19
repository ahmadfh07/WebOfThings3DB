const mongoose = require("mongoose");
const sensorSchema = new mongoose.Schema({
  sensor_id: {
    type: String,
    required: true,
  },
  zone_id: {
    type: String,
    required: true,
  },
  data: {
    location: Object,
    value: Number,
  },
});
const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
