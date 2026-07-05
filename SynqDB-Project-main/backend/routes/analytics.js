const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/top-content", (req, res) => {

  const query = `
    SELECT 
      c.ContentID,
      c.Title,
      COUNT(s.StreamID) AS TotalStreams
    FROM stream s
    JOIN content c ON s.ContentID = c.ContentID
    GROUP BY c.ContentID, c.Title
    ORDER BY TotalStreams DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Analytics query failed");
    } else {
      res.json(results);
    }
  });

});

router.get("/creator-earnings", (req, res) => {

  const query = `
    SELECT 
      cr.CreatorID,
      cr.Name,
      w.Balance
    FROM creator cr
    LEFT JOIN wallet w
      ON cr.CreatorID = w.CreatorID
    ORDER BY w.Balance DESC
  `;

  db.query(query, (err, results) => {

    if (err) {
      console.error(err);
      res.status(500).send(err.message);
    } else {
      res.json(results);
    }

  });

});

router.get("/top-genres", (req, res) => {
  const query = `
    SELECT 
      g.GenreID,
      g.Name AS Genre,
      COUNT(s.StreamID) AS TotalStreams
    FROM genre g
    JOIN content_genre cg ON g.GenreID = cg.GenreID
    JOIN content c ON cg.ContentID = c.ContentID
    LEFT JOIN stream s ON c.ContentID = s.ContentID
    GROUP BY g.GenreID, g.Name
    ORDER BY TotalStreams DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
});

router.get("/podcast-popularity", (req, res) => {

  const query = `
    SELECT 
      ps.SeriesID,
      ps.Title AS Podcast,
      COUNT(s.StreamID) AS TotalStreams
    FROM podcast_series ps
    JOIN podcast_episode pe ON ps.SeriesID = pe.SeriesID
    JOIN content c ON pe.ContentID = c.ContentID
    LEFT JOIN stream s ON c.ContentID = s.ContentID
    GROUP BY ps.SeriesID, ps.Title
    ORDER BY TotalStreams DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    res.json(results);
  });

});

router.get("/ad-revenue", (req, res) => {

  const query = `
    SELECT 
      adv.AdvertiserID,
      adv.Name AS Advertiser,
      SUM(ai.RevenueGenerated) AS TotalRevenue
    FROM advertiser adv
    JOIN advertisement ad ON adv.AdvertiserID = ad.AdvertiserID
    JOIN ad_impression ai ON ad.AdID = ai.AdID
    GROUP BY adv.AdvertiserID, adv.Name
    ORDER BY TotalRevenue DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    res.json(results);
  });

});

router.get("/device-streams", (req, res) => {

  const query = `
    SELECT 
      d.DeviceType,
      COUNT(s.StreamID) AS TotalStreams
    FROM device d
    LEFT JOIN stream s
      ON d.DeviceID = s.DeviceID
    GROUP BY d.DeviceType
    ORDER BY TotalStreams DESC
  `;

  db.query(query, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }

    res.json(results);

  });

});

module.exports = router;

