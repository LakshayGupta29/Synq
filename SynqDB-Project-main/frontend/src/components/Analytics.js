import React, { useEffect, useState } from "react";
import {
  getTopContent,
  getCreatorEarnings,
  getTopGenres
} from "../services/api";

import { getDeviceStreams } from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Analytics() {

  const [content, setContent] = useState([]);
  const [creators, setCreators] = useState([]);
  const [genres, setGenres] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {

    getTopContent().then(res => setContent(res.data));
    getCreatorEarnings().then(res => setCreators(res.data));
    getTopGenres().then(res => setGenres(res.data));
    getDeviceStreams().then(res => setDevices(res.data));

  }, []);

  return (

<div>

<h1>📊 Analytics Dashboard</h1>

<div className="analytics-grid">

<div className="card">
<h3>Top Streamed Content</h3>

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={content}>
    <CartesianGrid strokeDasharray="3 3"/>
    <XAxis dataKey="Title"/>
    <YAxis/>
    <Tooltip/>
    <Bar dataKey="TotalStreams" fill="#1DB954"/>
  </BarChart>
</ResponsiveContainer>

</div>


<div className="card">
<h3>Creator Earnings</h3>

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={creators}>
    <CartesianGrid strokeDasharray="3 3"/>
    <XAxis dataKey="Name"/>
    <YAxis/>
    <Tooltip/>
    <Bar dataKey="Balance" fill="#ff7f50"/>
  </BarChart>
</ResponsiveContainer>

</div>


<div className="card">
<h3>Top Genres</h3>

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={genres}>
    <CartesianGrid strokeDasharray="3 3"/>
    <XAxis dataKey="Genre"/>
    <YAxis/>
    <Tooltip/>
    <Bar dataKey="TotalStreams" fill="#8884d8"/>
  </BarChart>
</ResponsiveContainer>

</div>


<div className="card">
<h3>Streams by Device</h3>

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={devices}>
    <CartesianGrid strokeDasharray="3 3"/>
    <XAxis dataKey="DeviceType"/>
    <YAxis/>
    <Tooltip/>
    <Bar dataKey="TotalStreams" fill="#00C49F"/>
  </BarChart>
</ResponsiveContainer>

</div>

</div>

</div>

);
}