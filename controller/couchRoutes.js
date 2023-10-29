const express = require("express");
const router = express.Router();
const Sensor = require("../model/couchSensorSchema");
const FindOptions = require("ottoman").FindOptions;
const { Data, ReferenceSensor } = require("../model/referenceCouchSensorSchema");

router.get("/useembed/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const result = await Sensor.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    res.send({ error: false, msg: "Sensor data retrieved", data: { sensor_id: result.sensor_id, zone_id: result.zone_id, data: result.data } });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/useembed/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    let sensor;
    try {
      sensor = await Sensor.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    } catch (err) {
      if (err.message == "document not found") sensor = await Sensor.create({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId, data: [] });
    }
    sensor.data.push({ location: { longitude: req.body.longitude, latitude: req.body.latitude }, value: req.body.value });
    const sensorFinal = await sensor.save();
    res.send({ error: false, msg: "Sensor data input success!" });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.get("/usereference/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const options = new FindOptions({ limit: 5 });
    const Sensor = await ReferenceSensor.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId }, options);
    const datas = await Data.find({ sensor_id: req.params.sensorId });
    res.send({ error: false, msg: "Sensor data retrieved", data: { sensor_id: Sensor.sensor_id, zone_id: Sensor.zone_id, data: datas.rows } });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/usereference/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    try {
      const checkDupe = await ReferenceSensor.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    } catch (err) {
      const Sensor = await ReferenceSensor.create({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    }
    const data = await Data.create({ sensor_id: req.params.sensorId, longitude: req.body.longitude, latitude: req.body.latitude, value: req.body.value });
    res.send({ error: false, msg: "Sensor data input success!" });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

module.exports = router;
