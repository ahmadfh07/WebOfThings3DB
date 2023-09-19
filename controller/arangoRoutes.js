const express = require("express");
const router = express.Router();
const Sensor = require("../model/couchSensorSchema");
const { db } = require("../utils/arangoConnect");
const { aql } = require("arangojs");
const sensorColl = db.collection("Sensor");

router.get("/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const result = await db.query(aql`
    FOR sensor IN Sensor 
    FILTER sensor.sensor_id == ${req.params.sensorId} && sensor.zone_id == ${req.params.zoneId}
    RETURN sensor`);
    const data = await result.all();
    res.send({ error: false, msg: "Sensor data retrieved", data });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    // const sensor = await sensorColl.create("Sensor");
    const newSensor = new Sensor({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId, data: { location: { longitude: req.body.longitude, latitude: req.body.latitude }, value: req.body.value } });
    const result = await sensorColl.save(newSensor);
    res.send({ error: false, msg: "Sensor data input success!", data: result });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

module.exports = router;
