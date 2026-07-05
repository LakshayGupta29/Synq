require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const hostEnv = process.env.DB_HOST || 'localhost';
    const [host, port] = hostEnv.split(':');

    const conn = await mysql.createConnection({
      host,
      port: port ? Number(port) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Test subscription insert
    const testSubId = Math.floor(Math.random() * 1000000);
    const testPayId = Math.floor(Math.random() * 1000000);
    
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];

    console.log('Testing subscription insert...');
    console.log(`SubscriptionID: ${testSubId}, PaymentID: ${testPayId}`);

    const [subResult] = await conn.execute(
      'INSERT INTO user_subscription (SubscriptionID, StartDate, EndDate, Status, UserID, PlanID) VALUES (?, ?, ?, ?, ?, ?)',
      [testSubId, startDate, endDate, 'Active', 10, 1401]
    );
    console.log('✓ Subscription inserted:', subResult);

    const [payResult] = await conn.execute(
      'INSERT INTO payment (PaymentID, Amount, Method, Status, SubscriptionID) VALUES (?, ?, ?, ?, ?)',
      [testPayId, 9.99, 'Credit Card', 'Success', testSubId]
    );
    console.log('✓ Payment inserted:', payResult);

    // Verify
    const [subs] = await conn.query('SELECT * FROM user_subscription WHERE SubscriptionID = ?', [testSubId]);
    console.log('Subscription record:', JSON.stringify(subs, null, 2));

    const [pays] = await conn.query('SELECT * FROM payment WHERE SubscriptionID = ?', [testSubId]);
    console.log('Payment record:', JSON.stringify(pays, null, 2));

    await conn.end();
    console.log('\n✓ Test passed: Data was successfully inserted into database');
    process.exit(0);
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
})();
