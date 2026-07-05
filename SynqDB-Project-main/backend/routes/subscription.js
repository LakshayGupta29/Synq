const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {

  console.log("Subscription request received:", req.body);

  const { subscriptionId, userId, planId, paymentId, method } = req.body;

  if (!subscriptionId || !userId || !planId || !paymentId || !method) {
    console.error("Missing required fields:", { subscriptionId, userId, planId, paymentId, method });
    return res.status(400).json({ error: "Missing required fields" });
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  // Format dates as YYYY-MM-DD for SQL DATE type
  const formatDate = (date) => date.toISOString().split('T')[0];

  const insertSubscription = `
    INSERT INTO user_subscription
    (SubscriptionID, StartDate, EndDate, Status, UserID, PlanID)
    VALUES (?, ?, ?, 'Active', ?, ?)
  `;

  db.query(
    insertSubscription,
    [subscriptionId, formatDate(startDate), formatDate(endDate), userId, planId],
    (err) => {

      if (err) {
        console.error('Subscription insert error:', err);
        return res.status(500).json({ error: "Subscription failed", details: err.message });
      }

      const insertPayment = `
        INSERT INTO payment
        (PaymentID, Amount, Method, Status, SubscriptionID)
        VALUES (?, 9.99, ?, 'Success', ?)
      `;

      db.query(
        insertPayment,
        [paymentId, method, subscriptionId],
        (err2) => {

      if (err2) {
        console.error('Payment insert error:', err2);
        return res.status(500).json({ error: "Payment failed", details: err2.message });
      }

      console.log('Subscription and payment recorded successfully for Sub:', subscriptionId);
      res.json({ message: "Subscription successful" });

        }
      );

    }
  );

});

module.exports = router;