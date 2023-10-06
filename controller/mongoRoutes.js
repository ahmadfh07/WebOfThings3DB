const express = require("express");
const router = express.Router();
const Sensor = require("../model/mongoSensorSchema");
const { Data, ReferenceSensor: sensorReference } = require("../model/referenceMongoSensorSchema");

router.get("/useembed/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const result = await Sensor.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    res.send({ error: false, msg: "Sensor data retrieved", data: result });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/useembed/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const sensor = await Sensor.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    if (!sensor) {
      const newSensor = await Sensor.insertMany({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    }
    const updateSensor = await Sensor.findOneAndUpdate(
      { sensor_id: req.params.sensorId, zone_id: req.params.zoneId },
      { $push: { data: { location: { longitude: req.body.longitude, latitude: req.body.latitude }, value: req.body.value } } }
    );
    res.send({ error: false, msg: "Sensor data input success!", data: newSensor });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.get("/usereference/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const Sensor = await sensorReference.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    const datas = await Data.find({ sensor_id: req.params.sensorId }).select("-_id location value");
    res.send({ error: false, msg: "Sensor data retrieved", data: { sensor_id: Sensor.sensor_id, zone_id: Sensor.zone_id, data: datas } });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/usereference/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const checkDupe = await sensorReference.findOne({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    if (!checkDupe) {
      const Sensor = await sensorReference.insertMany({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    }
    const data = await Data.insertMany({ sensor_id: req.params.sensorId, location: { longitude: req.body.longitude, latitude: req.body.latitude }, value: req.body.value });
    res.send({ error: false, msg: "Sensor data input success!", data: { Sensor, data } });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

module.exports = router;
