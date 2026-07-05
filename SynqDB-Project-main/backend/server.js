require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const contentRoutes = require("./routes/content");
const streamRoutes = require("./routes/stream");

// TEMPORARILY COMMENT THESE
const subscriptionRoutes = require("./routes/subscription");
// const playlistRoutes = require("./routes/playlist");
// const followRoutes = require("./routes/follow");
const analyticsRoutes = require("./routes/analytics");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/content", contentRoutes);
app.use("/api/stream", streamRoutes);

app.use("/api/subscription", subscriptionRoutes);
// app.use("/api/playlist", playlistRoutes);
// app.use("/api/follow", followRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("SynqDB backend running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});