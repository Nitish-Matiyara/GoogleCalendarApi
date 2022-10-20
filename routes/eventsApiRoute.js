const express = require("express");
const router = express.Router();
const {
  dateTime,
  event,
  insertEvent,
  getAllEvents,
  deleteEvent,
  getSingleEvent,
  updateEvent,
} = require("../controllers/eventsController");

//CREATE
router.post("/insertEvent", async (req, res, next) => {
  try {
    const result = await insertEvent(req);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

//READ All Events
router.get("/getEvents", async (req, res) => {
  try {
    const { start, end } = req.body;
    const eventData = await getAllEvents(start, end);
    res.send(eventData);
  } catch (error) {
    res.status(400).send(error);
  }
});

//READ Single Event with EventID
router.get("/getSingleEvent/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event= await getSingleEvent(eventId);
    res.send(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

//DELETE
router.delete("/deleteEvent/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const deleted = await deleteEvent(eventId);
    res.send(deleted);
  } catch (error) {
    res.status(400).send(error);
  }
});

//UPDATE
router.patch('/updateEvent/:eventId', async (req,res) => {
try {
  const eventId = req.params.eventId;
  const update = await updateEvent(eventId, req)
  res.send(update)
} catch (error) {
  res.status(400).send(error);
}
})

module.exports = router;
