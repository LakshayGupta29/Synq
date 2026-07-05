import React, { useEffect, useState } from "react";
import { getContent, streamContent } from "../services/api";

export default function ContentList() {

  const [content, setContent] = useState([]);

  useEffect(() => {
    getContent()
      .then(res => setContent(res.data))
      .catch(err => {
        console.error("Failed to load content:", err);
        setContent([]);
      });
  }, []);

  const play = (contentID) => {

    const data = {
  streamId: Math.floor(Math.random()*100000),
  userId: 10,
  contentId: contentID,
  deviceId: 301,
  durationPlayed: 200,
  completionPercent: 100,
  deviceType: "Mobile",
  revenueGenerated: 0.02
};

    streamContent(data).then(() => alert("Stream recorded"));
  };

  return (
<div>

<h2>🎵 Content Library</h2>

{content.map(c => (

<div key={c.ContentID} className="card">

<h3>{c.Title}</h3>
<p>
{c.ContentType === "Music" && "🎵"}
{c.ContentType === "Podcast" && "🎙"}
{c.ContentType === "Audiobook" && "📚"}
{c.ContentType === "Live" && "🔴"}
 {c.ContentType}
</p>

<p>Content ID: {c.ContentID}</p>

<button onClick={() => play(c.ContentID)}>
▶ Play
</button>

</div>

))}

</div>
);
}

const card = {
  border: "1px solid #ccc",
  margin: "10px",
  padding: "10px"
};