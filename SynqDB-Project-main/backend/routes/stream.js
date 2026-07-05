const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {

  const {
  streamId,
  userId,
  contentId,
  deviceId,
  durationPlayed,
  completionPercent,
  deviceType,
  revenueGenerated
} = req.body;

  const query = `
INSERT INTO stream
(StreamID, DurationPlayed, CompletionPercent, DeviceType,
 RevenueGenerated, UserID, ContentID, DeviceID)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

  db.query(
    query,
    [
  streamId,
  durationPlayed,
  completionPercent,
  deviceType,
  revenueGenerated,
  userId,
  contentId,
  deviceId
],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Stream failed");
      } else {
        res.send("Stream recorded successfully");
      }
    }
  );

});

module.exports = router;