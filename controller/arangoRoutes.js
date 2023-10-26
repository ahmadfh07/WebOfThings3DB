const express = require("express");
const router = express.Router();
// const Sensor = require("../model/arangoSensorSchema");
const { db } = require("../utils/arangoConnect");
const { aql } = require("arangojs");
const sensorColl = db.collection("Sensor");
const referenceSensorColl = db.collection("referenceSensor");
const dataColl = db.collection("Data");

router.get("/useembed/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const result = await db.query(aql`
    FOR s IN Sensor 
    FILTER s.sensor_id == ${req.params.sensorId} && s.zone_id == ${req.params.zoneId}
    RETURN {sensor_id:s.sensor_id,zone_id:s.zone_id,data:s.data}`);
    const data = await result.all();
    res.send({ error: false, msg: "Sensor data retrieved", data });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/useembed/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const sensor = await db.query(aql`
    FOR sensor IN Sensor 
    FILTER sensor.sensor_id == ${req.params.sensorId} && sensor.zone_id == ${req.params.zoneId}
    COLLECT WITH COUNT INTO length
    RETURN length`);
    let result;
    let updateDataArray;
    const count = await sensor.all();
    console.log("count", count[0]);
    if (!count[0] > 0) {
      const newSensor = { sensor_id: req.params.sensorId, zone_id: req.params.zoneId, data: [] };
      result = await sensorColl.save(newSensor);
    }
    const updateData = await db.query(aql`
    FOR s IN Sensor
    FILTER s.sensor_id == ${req.params.sensorId} && s.zone_id == ${req.params.zoneId}
    UPDATE s WITH { data: APPEND(s.data, { location: { longitude: ${req.body.longitude}, latitude: ${req.body.latitude} }, value: ${req.body.value} })} IN Sensor`);
    updateDataArray = await updateData.all();
    res.send({ error: false, msg: "Sensor data input success!" });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.get("/usereference/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    const sensor = await db.query(aql`
    FOR s IN referenceSensor
    FILTER s.sensor_id == ${req.params.sensorId} && s.zone_id == ${req.params.zoneId}
    RETURN {sensor_id: s.sensor_id, zone_id : s.zone_id}`);
    const sensorArray = await sensor.all();
    const data = await db.query(aql`
    FOR d IN Data
    FILTER d.sensor_id == ${sensorArray[0].sensor_id}
    RETURN {location : {latitude:d.latitude, longitude:d.longitude}, value:d.value}
    `);
    const dataArray = await data.all();
    res.send({ error: false, msg: "Sensor data retrieved", data: { sensor_id: sensorArray[0].sensor_id, zone_id: sensorArray[0].zone_id, data: dataArray } });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

router.post("/usereference/sensor/:sensorId/:zoneId", async (req, res) => {
  try {
    // const referenceSensor = await referenceSensorColl.create("referenceSensor");
    // const Data = await dataColl.create("Data");
    const sensor = await db.query(aql`
    FOR sensor IN referenceSensor 
    FILTER sensor.sensor_id == ${req.params.sensorId}
    COLLECT WITH COUNT INTO length
    RETURN length`);
    const count = await sensor.all();
    if (!count[0] > 0) {
      const newSensor = new Sensor({ sensor_id: req.params.sensorId, zone_id: req.params.zoneId });
      const result = await referenceSensorColl.save(newSensor);
    }
    const data = await dataColl.save({ sensor_id: req.params.sensorId, latitude: req.body.latitude, longitude: req.body.longitude, value: req.body.value });
    res.send({ error: false, msg: "Sensor data input success!" });
  } catch (err) {
    res.send({ error: true, msg: err.message });
  }
});

module.exports = router;
