-- AgroConnect Complete Database Setup (User-Specific Data)
-- Execute: mysql -u root -pRoot@123 < backend/database-setup.sql

CREATE DATABASE IF NOT EXISTS agroconnect3;
USE agroconnect3;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  role ENUM('farmer', 'admin', 'krushi') NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crops (NOW with user_id for per-user data)
CREATE TABLE IF NOT EXISTS crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  farmerName VARCHAR(100),
  village VARCHAR(100),
  mobile VARCHAR(20),
  cropName VARCHAR(100),
  cropProblem TEXT,
  image VARCHAR(255) NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Consultant advice
CREATE TABLE IF NOT EXISTS consultant_advice (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crop_id INT NOT NULL,
  officer_name VARCHAR(100) NOT NULL,
  advice TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

-- Sample data
INSERT IGNORE INTO users (name, mobile, location, role, email, password) VALUES
('Demo Farmer 1', '9876543210', 'Village A', 'farmer', 'farmer1@test.com', '123456'),
('Demo Farmer 2', '9876543211', 'Village B', 'farmer', 'farmer2@test.com', '123456'),
('Demo Krushi', '9876543212', 'Agri Office', 'krushi', 'krushi@test.com', '123456');

SELECT 'Database setup complete! User-specific crops ready.' as status;
