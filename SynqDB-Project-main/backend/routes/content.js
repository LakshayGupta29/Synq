const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {

  const query = `
    SELECT 
    c.ContentID,
    c.Title,

    CASE
        WHEN mt.ContentID IS NOT NULL THEN 'Music'
        WHEN pe.ContentID IS NOT NULL THEN 'Podcast'
        WHEN ac.ContentID IS NOT NULL THEN 'Audiobook'
        WHEN ls.ContentID IS NOT NULL THEN 'Live'
        ELSE 'Other'
    END AS ContentType

FROM content c

LEFT JOIN music_track mt
ON c.ContentID = mt.ContentID

LEFT JOIN podcast_episode pe
ON c.ContentID = pe.ContentID

LEFT JOIN audiobook_chapter ac
ON c.ContentID = ac.ContentID

LEFT JOIN live_session ls
ON c.ContentID = ls.ContentID;
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });

});

module.exports = router;