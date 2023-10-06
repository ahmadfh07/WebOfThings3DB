const { model, Schema } = require("ottoman");

const referenceSensorSchema = new Schema({
  sensor_id: {
    type: String,
    required: true,
  },
  zone_id: {
    type: String,
    required: true,
  },
});
const ReferenceSensor = model("ReferenceSensor", referenceSensorSchema);

const dataSchema = new Schema({
  sensor_id: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  value: {
    type: Number,
  },
});

const Data = model("Data", dataSchema);

module.exports = { ReferenceSensor, Data };
