require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const hostEnv = process.env.DB_HOST || 'localhost';
    const [host, port] = hostEnv.split(':');

    const connection = await mysql.createConnection({
      host,
      port: port ? Number(port) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    const sql = `
      CREATE TABLE IF NOT EXISTS content (
        ContentID INT PRIMARY KEY,
        Title VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS music_track (
        TrackID INT PRIMARY KEY AUTO_INCREMENT,
        ContentID INT NOT NULL,
        Duration INT,
        FOREIGN KEY (ContentID) REFERENCES content(ContentID)
      );

      CREATE TABLE IF NOT EXISTS podcast_series (
        SeriesID INT PRIMARY KEY,
        Title VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS podcast_episode (
        EpisodeID INT PRIMARY KEY AUTO_INCREMENT,
        SeriesID INT NOT NULL,
        ContentID INT NOT NULL,
        FOREIGN KEY (SeriesID) REFERENCES podcast_series(SeriesID),
        FOREIGN KEY (ContentID) REFERENCES content(ContentID)
      );

      CREATE TABLE IF NOT EXISTS audiobook_chapter (
        ChapterID INT PRIMARY KEY AUTO_INCREMENT,
        ContentID INT NOT NULL,
        ChapterNumber INT,
        FOREIGN KEY (ContentID) REFERENCES content(ContentID)
      );

      CREATE TABLE IF NOT EXISTS live_session (
        SessionID INT PRIMARY KEY AUTO_INCREMENT,
        ContentID INT NOT NULL,
        StartedAt DATETIME,
        FOREIGN KEY (ContentID) REFERENCES content(ContentID)
      );

      CREATE TABLE IF NOT EXISTS device (
        DeviceID INT PRIMARY KEY,
        DeviceType VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS stream (
        StreamID INT PRIMARY KEY,
        DurationPlayed INT,
        CompletionPercent INT,
        DeviceType VARCHAR(100),
        RevenueGenerated DECIMAL(10,2),
        UserID INT,
        ContentID INT,
        DeviceID INT,
        FOREIGN KEY (ContentID) REFERENCES content(ContentID),
        FOREIGN KEY (DeviceID) REFERENCES device(DeviceID)
      );

      CREATE TABLE IF NOT EXISTS creator (
        CreatorID INT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wallet (
        WalletID INT PRIMARY KEY AUTO_INCREMENT,
        CreatorID INT NOT NULL,
        Balance DECIMAL(10,2) DEFAULT 0,
        FOREIGN KEY (CreatorID) REFERENCES creator(CreatorID)
      );

      CREATE TABLE IF NOT EXISTS genre (
        GenreID INT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS content_genre (
        ContentID INT NOT NULL,
        GenreID INT NOT NULL,
        PRIMARY KEY (ContentID, GenreID),
        FOREIGN KEY (ContentID) REFERENCES content(ContentID),
        FOREIGN KEY (GenreID) REFERENCES genre(GenreID)
      );

      CREATE TABLE IF NOT EXISTS advertiser (
        AdvertiserID INT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS advertisement (
        AdID INT PRIMARY KEY,
        AdvertiserID INT NOT NULL,
        FOREIGN KEY (AdvertiserID) REFERENCES advertiser(AdvertiserID)
      );

      CREATE TABLE IF NOT EXISTS ad_impression (
        ImpressionID INT PRIMARY KEY AUTO_INCREMENT,
        AdID INT NOT NULL,
        RevenueGenerated DECIMAL(10,2) DEFAULT 0,
        FOREIGN KEY (AdID) REFERENCES advertisement(AdID)
      );

      CREATE TABLE IF NOT EXISTS user_subscription (
        SubscriptionID INT PRIMARY KEY,
        StartDate DATETIME,
        EndDate DATETIME,
        Status VARCHAR(50),
        UserID INT,
        PlanID INT
      );

      CREATE TABLE IF NOT EXISTS payment (
        PaymentID INT PRIMARY KEY,
        Amount DECIMAL(10,2),
        Method VARCHAR(100),
        Status VARCHAR(100),
        SubscriptionID INT,
        FOREIGN KEY (SubscriptionID) REFERENCES user_subscription(SubscriptionID)
      );

      INSERT IGNORE INTO content (ContentID, Title) VALUES
        (1, 'Summer Beats'),
        (2, 'Tech Talks Podcast'),
        (3, 'Mystery Audiobook'),
        (4, 'Live Concert');

      INSERT IGNORE INTO music_track (ContentID, Duration) VALUES (1, 230);
      INSERT IGNORE INTO podcast_series (SeriesID, Title) VALUES (1, 'Tech Talks');
      INSERT IGNORE INTO podcast_episode (SeriesID, ContentID) VALUES (1, 2);
      INSERT IGNORE INTO audiobook_chapter (ContentID, ChapterNumber) VALUES (3, 1);
      INSERT IGNORE INTO live_session (ContentID, StartedAt) VALUES (4, NOW());

      INSERT IGNORE INTO device (DeviceID, DeviceType) VALUES
        (301, 'Mobile'),
        (302, 'Desktop');

      INSERT IGNORE INTO stream (StreamID, DurationPlayed, CompletionPercent, DeviceType, RevenueGenerated, UserID, ContentID, DeviceID) VALUES
        (1001, 200, 100, 'Mobile', 0.02, 10, 1, 301),
        (1002, 180, 100, 'Desktop', 0.03, 11, 2, 302),
        (1003, 120, 100, 'Mobile', 0.01, 12, 3, 301);

      INSERT IGNORE INTO creator (CreatorID, Name) VALUES (501, 'Ariana'), (502, 'Tech Media');
      INSERT IGNORE INTO wallet (CreatorID, Balance) VALUES (501, 325.50), (502, 410.75);

      INSERT IGNORE INTO genre (GenreID, Name) VALUES (1, 'Pop'), (2, 'Technology'), (3, 'Mystery');
      INSERT IGNORE INTO content_genre (ContentID, GenreID) VALUES (1, 1), (2, 2), (3, 3);

      INSERT IGNORE INTO advertiser (AdvertiserID, Name) VALUES (801, 'Acme Ads');
      INSERT IGNORE INTO advertisement (AdID, AdvertiserID) VALUES (9001, 801);
      INSERT IGNORE INTO ad_impression (AdID, RevenueGenerated) VALUES (9001, 15.00);

      INSERT IGNORE INTO user_subscription (SubscriptionID, StartDate, EndDate, Status, UserID, PlanID) VALUES (2001, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'Active', 10, 1401);
      INSERT IGNORE INTO payment (PaymentID, Amount, Method, Status, SubscriptionID) VALUES (3001, 9.99, 'Credit Card', 'Success', 2001);
    `;

    await connection.query(sql);
    console.log('Database schema created and sample data inserted.');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message || error);
    process.exit(1);
  }
})();
