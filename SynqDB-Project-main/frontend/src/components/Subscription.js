import React from "react";
import { subscribe } from "../services/api";

export default function Subscription() {

  const buy = () => {

    const data = {
      subscriptionId: Math.floor(Math.random()*100000),
      userId: 10,
      planId: 1401,
      paymentId: Math.floor(Math.random()*100000),
      method: "Credit Card"
    };

    console.log("📤 Sending subscription request:", data);

    subscribe(data)
      .then((res) => {
        console.log("✅ Response from server:", res.data);
        alert("✅ Subscription successful! Check your database.");
      })
      .catch(err => {
        console.error("❌ Subscription error:", err.response?.data || err.message);
        alert("❌ Subscription failed: " + (err.response?.data?.error || err.message || "Unknown error"));
      });
  };

  return (
    <div>
      <h2>Upgrade to Premium</h2>

      <button onClick={buy}>
        Buy Subscription
      </button>
    </div>
  );
}