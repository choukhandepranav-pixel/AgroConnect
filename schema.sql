-- AgroConnect: Database schema for farmer requests and consultant advice
-- Run this in MySQL if you are setting up the database from scratch.
-- Use existing database or create: CREATE DATABASE IF NOT EXISTS agroconnect3; USE agroconnect3;

-- Farmer crop issues (requests) – already used by server
-- Ensure table has: id, farmerName, village, mobile, cropName, cropProblem, image, status
CREATE TABLE IF NOT EXISTS crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmerName VARCHAR(100),
  village VARCHAR(100),
  mobile VARCHAR(20),
  cropName VARCHAR(100),
  cropProblem TEXT,
  image VARCHAR(255) NULL,
  status VARCHAR(20) DEFAULT 'pending'
);

-- Advice from Krushi Adhikari (Agriculture Consultant)
CREATE TABLE IF NOT EXISTS consultant_advice (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crop_id INT NOT NULL,
  officer_name VARCHAR(100) NOT NULL,
  advice TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);
