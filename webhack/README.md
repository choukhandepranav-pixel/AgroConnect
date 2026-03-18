# AgroConnect – Smart Agriculture Help System

AgroConnect is a hackathon project that connects **Farmers** with **Krushi Adhikari** through a simple web portal.  
Farmers can register, log in, and submit crop problems. Krushi Adhikari can review requests, approve or reject them,
and send back detailed advice and recommended fertilizers. All solved cases are stored and shown as FAQ for learning.

## Features

- **Multi‑role authentication**
  - Register and login as **Farmer**, **Krushi Adhikari**, or **Admin**.
  - Passwords are stored securely using bcrypt hashing.

- **Farmer portal (`dashboard.html`)**
  - View a basic profile created from registration data.
  - Submit new crop issues (crop + description, image upload support available via `/upload`).
  - Track status indirectly via FAQ when Krushi Adhikari responds.

- **Krushi Adhikari portal (`krushi.html`)**
  - See all **pending** farmer requests from the database.
  - Approve with advice and recommended fertilizer, or reject.
  - Only valid users with role `krushi` can respond.

- **Admin portal (`admin.html`)**
  - Simple overview page for hackathon demo, can be extended with metrics/user management.

- **FAQ knowledge base**
  - All **approved/rejected** requests are stored and exposed via `/api/faq`.
  - `index.html` shows these as FAQ cards so farmers and judges can see real interactions.

- **Language support (basic)**
  - Front page and dashboard texts can be switched between English, Hindi, and Marathi.

## Tech Stack

- **Frontend**: HTML, CSS, vanilla JavaScript (`public/`)
- **Backend**: Node.js + Express (`server.js`)
- **Database**: MySQL
- **Libraries**:
  - `express` – web framework
  - `mysql` / `mysql2` – database driver
  - `multer` – image upload handling
  - `bcryptjs` – password hashing
  - `cors` – CORS middleware

## Project Structure (main files)

- `public/index.html` – Landing page, navigation, FAQ, About section.
- `public/login.html` – Login screen for all roles.
- `public/register.html` – Registration with role selector (Farmer / Admin / Krushi Adhikari).
- `public/dashboard.html` – Farmer dashboard & crop issue form.
- `public/krushi.html` – Krushi Adhikari dashboard for requests.
- `public/admin.html` – Admin dashboard shell for demo.
- `public/style.css`, `public/dashboard.css`, `public/krushi.css` – Styling.
- `public/script.js` – Shared JS: page navigation, language switch, FAQ + request handlers.
- `server.js` – Express server, APIs, MySQL integration.
- `package.json` – Node dependencies and scripts.

## Database Schema (MySQL)

Create the database and tables (example):

```sql
CREATE DATABASE IF NOT EXISTS agroconnect;
USE agroconnect;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'farmer', 'admin', 'krushi'
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id INT NOT NULL,
  krushi_id INT NULL,
  crop VARCHAR(100) NOT NULL,
  problem TEXT NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  advice TEXT NULL,
  fertilizer VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (farmer_id) REFERENCES users(id),
  FOREIGN KEY (krushi_id) REFERENCES users(id)
);
```

Update `server.js` MySQL credentials if needed:

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agroconnect",
});
```

## Backend API Overview

- `POST /api/register` – Create new user (name, mobile, location, role, email, password).
- `POST /api/login` – Login, returns role + basic profile; frontend stores it in `localStorage`.
- `POST /upload` – Image upload (Multer), stores files in `uploads/`.
- `POST /api/requests` – Farmer sends new crop issue (only if registered with role `farmer`).
- `GET /api/requests/pending` – Krushi Adhikari loads all pending requests.
- `POST /api/requests/:id/respond` – Krushi approves/rejects with advice + fertilizer.
- `GET /api/faq` – Returns all approved/rejected requests for FAQ display.

## Running the Project Locally

1. Install dependencies:

```bash
cd webhack
npm install
```

2. Start MySQL and create the `agroconnect` database + tables (see SQL above).

3. Start the backend:

```bash
npm start
```

4. Open the app in your browser:

```text
http://localhost:3000/index.html
```

## Hackathon Demo Flow

1. **Register**:
   - Create a Farmer account and a Krushi Adhikari account with different emails.
2. **Farmer**:
   - Login → redirected to `dashboard.html`.
   - Go to “My Crop Issues”, submit a new crop problem.
3. **Krushi Adhikari**:
   - Login → redirected to `krushi.html`.
   - Enter their Krushi email, see pending requests, approve/reject with advice + fertilizer.
4. **FAQ**:
   - Go back to `index.html` → FAQ tab to see the interaction recorded.

This demonstrates **frontend + backend + database + real workflow** in one cohesive hackathon project.

