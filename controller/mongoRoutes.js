const express = require("express");
const router = express.Router();
const Sensor = require("../model/Sensor");

router.get("/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const result = await Sensor.find({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
    res.send({ error: false, msg: "Sensor data retrieved", data: result });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const newSensor = await Sensor.insertMany({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId, data: { location: { longitude: req.body.longitude, latitude: req.body.latitude }, value: req.body.value } });
    res.send({ error: false, msg: "Sensor data input success!", data: newSensor });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

module.exports = router;
