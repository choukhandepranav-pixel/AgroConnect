const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* MySQL Connection */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root@123",
    database: "agroconnect3"
});

db.connect(err=>{
    if(err){
        console.log("DB Error:",err);
    }else{
        console.log("MySQL Connected");
        // Ensure crops has status column and consultant_advice table exists
        db.query("ALTER TABLE crops ADD COLUMN status VARCHAR(20) DEFAULT 'pending'", (e) => { if (e && e.code !== 'ER_DUP_FIELDNAME') console.log(e); });
        db.query(`CREATE TABLE IF NOT EXISTS consultant_advice (
            id INT AUTO_INCREMENT PRIMARY KEY,
            crop_id INT NOT NULL,
            officer_name VARCHAR(100) NOT NULL,
            advice TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
        )`, () => {});
    }
});

/* Register */

app.post("/api/register",(req,res)=>{
const {name,mobile,location,role,email,password}=req.body;

const check="SELECT * FROM users WHERE email=?";

db.query(check,[email],(err,result)=>{

if(err){
console.log(err);
return res.status(500).json({message:"Database error"});
}

if(result.length>0){
return res.status(400).json({message:"Email already exists"});
}

const sql="INSERT INTO users(name,mobile,location,role,email,password) VALUES (?,?,?,?,?,?)";

db.query(sql,[name,mobile,location,role,email,password],(err,result)=>{

if(err){
console.log(err);
return res.status(500).json({message:"Registration failed"});
}

res.json({success: true, message:"Registration successful"});

});

});

});
/* Login */

app.post("/api/login",(req,res)=>{

const {email,password}=req.body;

const sql="SELECT * FROM users WHERE email=? AND password=?";

db.query(sql,[email,password],(err,result)=>{

if(err){
console.log(err);
return res.status(500).json({message:"Database error"});
}

if(result.length===0){
return res.status(401).json({message:"Invalid email or password"});
}

const user=result[0];

res.json({
message:"Login successful",
role:user.role,
user:user
});

});

});

/* Reset Password */

/* Reset Password - single clean endpoint */
app.post("/api/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  console.log("Reset request:", { email, newPassword: "***" }); // Debug log

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password required" });
  }

  // Check if user exists
  const checkSql = "SELECT id FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, result) => {
    if (err) {
      console.error("Check user error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("User check result length:", result.length); // Debug

    if (result.length === 0) {
      return res.status(404).json({ message: "Email not found. Please register first." });
    }

    // Update password
    const updateSql = "UPDATE users SET password = ? WHERE email = ?";
    db.query(updateSql, [newPassword, email], (err2, updateResult) => {
      if (err2) {
        console.error("Update password error:", err2);
        return res.status(500).json({ message: "Failed to reset password" });
      }
      console.log("Rows affected:", updateResult.affectedRows); // Debug
      res.json({ message: "Password reset successful! Please login with new password." });
    });
  });
});


/* Multer Setup */

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req,file,cb)=>{
        cb(null, Date.now()+"-"+file.originalname);
    }
});

const upload = multer({storage});

/* Upload Crop Problem */

app.post("/api/upload", upload.single("cropImage"), (req,res)=>{

    const {farmerName,village,mobile,cropName,cropProblem} = req.body;

    const image = req.file ? req.file.filename : null;

    const sql = `
    INSERT INTO crops (farmerName,village,mobile,cropName,cropProblem,image)
    VALUES (?,?,?,?,?,?)
    `;

    db.query(sql,[farmerName,village,mobile,cropName,cropProblem,image],(err,result)=>{

        if(err){
            console.log(err);
            return res.status(500).json({message:"Server Error"});
        }

        res.json({message:"Problem Submitted Successfully"});

    });

});

/* Get All Farmer Requests */

app.get("/api/requests",(req,res)=>{

    const sql = "SELECT * FROM crops ORDER BY id DESC";

    db.query(sql,(err,result)=>{

        if(err){
            console.log(err);
            return res.status(500).json({message:"Server Error"});
        }

        res.json(result);

    });

});

/* Get farmer's own requests */

app.get("/api/my-requests", (req, res) => {
    const { mobile } = req.query;
    if (!mobile) {
        return res.status(400).json({ message: "Mobile required" });
    }
    const sql = "SELECT * FROM crops WHERE mobile = ? ORDER BY id DESC";
    db.query(sql, [mobile], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Server Error" });
        }
        res.json(result);
    });
});

app.post("/register", (req, res) => {
  const { name, mobile, village, email, password, role, agriId } = req.body;

  // 👉 If Krushi Adhikari
  if(role === "krushi_adhikari"){

    if(!agriId){
      return res.json({ success: false, message: "Agri ID required" });
    }

    const check = "SELECT * FROM krushi_officers WHERE agri_id = ?";
    
    db.query(check, [agriId], (err, result) => {

      if(result.length === 0){
        return res.json({ success: false, message: "Invalid Agri ID ❌" });
      }

      const insert = `
        INSERT INTO users (name, mobile, village, email, password, role, agri_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insert, [name, mobile, village, email, password, role, agriId], () => {
        res.json({ success: true, message: "Krushi Adhikari Registered ✅" });
      });

    });

  } else {
    // 👉 Farmer
    const insert = `
      INSERT INTO users (name, mobile, village, email, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insert, [name, mobile, village, email, password, role], () => {
      res.json({ success: true, message: "Farmer Registered ✅" });
    });
  }
});

/* Get advice for Agriculture Consultant (farmer page). Optional: ?mobile= to get advice for one farmer */

app.get("/api/advice", (req, res) => {

    const { mobile } = req.query;

    let sql = `SELECT a.id, a.crop_id, a.officer_name, a.advice, a.created_at, c.farmerName, c.cropName, c.mobile 
               FROM consultant_advice a 
               JOIN crops c ON a.crop_id = c.id 
               ORDER BY a.created_at DESC`;

    const params = [];

    if (mobile) {

        sql = `SELECT a.id, a.crop_id, a.officer_name, a.advice, a.created_at, c.farmerName, c.cropName, c.mobile 
               FROM consultant_advice a 
               JOIN crops c ON a.crop_id = c.id 
               WHERE c.mobile = ? 
               ORDER BY a.created_at DESC`;

        params.push(mobile);

    }

    db.query(sql, params, (err, result) => {

        if (err) {

            console.log(err);
            return res.status(500).json({ message: "Server Error" });

        }

        res.json(result);

    });

});


/* Start Server */

app.listen(5000,()=>{
    console.log("Server running on http://localhost:5000");
});
app.post("/api/advice", (req, res) => {

const { cropId, officerName, advice } = req.body;

if (!cropId || !advice) {
    return res.json({ message: "Missing data" });
}

/* 1. Save advice */
db.query(
"INSERT INTO consultant_advice (crop_id, officer_name, advice) VALUES (?,?,?)",
[cropId, officerName, advice],
(err) => {

if (err) {
console.log(err);
return res.json({ message: "Failed to save advice" });
}

/* 2. Update crop status */
db.query(
"UPDATE crops SET status='solved' WHERE id=?",
[cropId],
(err2) => {

if (err2) {
console.log(err2);
return res.json({ message: "Advice saved but status not updated" });
}

res.json({ message: "Advice saved successfully" });

});

});

});
async function registerUser() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value,
    agriId: document.getElementById("agriId").value
  };

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
}
