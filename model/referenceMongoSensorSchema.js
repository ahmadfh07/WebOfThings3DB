const mongoose = require("mongoose");
const referenceSensorSchema = new mongoose.Schema({
  sensor_id: {
    type: String,
    required: true,
  },
  zone_id: {
    type: String,
    required: true,
  },
});
const ReferenceSensor = mongoose.model("ReferenceSensor", referenceSensorSchema);

const dataSchema = new mongoose.Schema({
  sensor_id: {
    type: String,
  },
  location: {
    type: Object,
    latitude: String,
    longitude: String,
  },
  value: {
    type: Number,
  },
});
const Data = mongoose.model("Data", dataSchema);

module.exports = { ReferenceSensor, Data };
