# AgroConnect 🌾 Smart Farming Platform

## Features ✅
- Farmer uploads crop issues with images
- Krushi Adhikari dashboard to review & send advice
- Farmer views received advice in \"Agriculture Consultant\" tab
- MySQL backend, image uploads, auth (register/login/reset)
- Responsive dashboard with stats/charts

## Tech Stack
```
Backend: Node.js/Express/MySQL
Frontend: HTML/CSS/JS (Vanilla)
DB: MySQL (agroconnect3)
Storage: Local uploads/
```

## Quick Setup 🚀

### 1. Prerequisites
```
Node.js 18+
MySQL 8+ (localhost, root/Root@123)
```

### 2. Clone & Install
```bash
# Current dir: AgroConnect-main/
npm init -y
npm install express mysql2 multer cors
```

### 3. Start MySQL & Server
```bash
# MySQL (new terminal)
mysql -u root -pRoot@123
CREATE DATABASE IF NOT EXISTS agroconnect3;
EXIT;

# Server (cwd: AgroConnect-main/)
node server.js
```

### 4. Open App
```
http://localhost:5000
- Register: farmer@ex.com / 123 | krushi@ex.com / 123 (role: krushi)
- Flow: farmer.html → submit issue → krushi.html → send advice → farmer.html → Agriculture Consultant tab
```

## Test Flow ✅
```
Farmer: Login → Send Crop Issue → My Requests (see pending) → Agriculture Consultant (see advice)
Krushi: Login → Farmer Complaints → Send Advice → see in Solved Problems
```

## API Endpoints
```
POST /api/upload - Submit complaint
GET /api/requests - Krushi complaints
POST /api/advice - Send advice  
GET /api/advice?mobile= - Farmer advice
GET /api/my-requests?mobile= - Farmer requests
```

## DB Schema (auto-created)
```
crops: farmerName,village,mobile,cropName,cropProblem,image,status
consultant_advice: crop_id,officer_name,advice
users: name,mobile,location,role,email,password
```

---

**Ready to run!** 🌱

