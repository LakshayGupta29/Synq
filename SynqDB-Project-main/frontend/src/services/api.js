import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getContent = () => API.get("/content");

export const streamContent = (data) =>
  API.post("/stream", data);

export const subscribe = (data) =>
  API.post("/subscription", data);

export const getTopContent = () =>
  API.get("/analytics/top-content");

export const getCreatorEarnings = () =>
  API.get("/analytics/creator-earnings");

export const getTopGenres = () =>
  API.get("/analytics/top-genres");

export const getPodcastPopularity = () =>
  API.get("/analytics/podcast-popularity");

export const getAdRevenue = () =>
  API.get("/analytics/ad-revenue");

export const getDeviceStreams = () =>
  API.get("/analytics/device-streams");