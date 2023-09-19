const { model, Schema } = require("ottoman");

const sensorSchema = new Schema({
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

const Sensor = model("sensor", sensorSchema);

module.exports = Sensor;
