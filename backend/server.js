const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use("/uploads", express.static(path.join(__dirname, '../uploads')));

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

res.json({message:"Registration successful"});

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
    destination: "../uploads/",
    filename: (req,file,cb)=>{
        cb(null, Date.now()+"-"+file.originalname);
    }
});

const upload = multer({storage});

/* Upload Crop Problem - USER SPECIFIC */

app.post("/api/upload", upload.single("cropImage"), (req,res)=>{

    const {user_id,farmerName,village,mobile,cropName,cropProblem} = req.body;

    if(!user_id){
        return res.status(400).json({message:"user_id required (login first)"});
    }

    const image = req.file ? req.file.filename : null;

    const sql = `
    INSERT INTO crops (user_id,farmerName,village,mobile,cropName,cropProblem,image)
    VALUES (?,?,?,?,?,?,?)
    `;

    db.query(sql,[user_id,farmerName,village,mobile,cropName,cropProblem,image],(err,result)=>{

        if(err){
            console.log(err);
            return res.status(500).json({message:"Server Error"});
        }

        res.json({message:"Problem Submitted Successfully! ID: " + result.insertId});

    });

});


/* Get Farmer Requests - USER SPECIFIC */

app.get("/api/requests", (req, res) => {
    const { user_id } = req.query;
    
    if (!user_id) {
        return res.status(400).json({message: "user_id required for requests"});
    }
    
    const sql = `
        SELECT * FROM crops 
        WHERE user_id = ? 
        ORDER BY id DESC
    `;
    
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({message: "Server Error"});
        }
        res.json(result);
    });
});


/* Save advice from Krushi Adhikari (Agriculture Consultant) */

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


app.post("/api/advice", (req,res)=>{

const { cropId, officerName, advice } = req.body;

/* Save advice */
db.query(
"INSERT INTO advice (request_id, officer_name, advice) VALUES (?,?,?)",
[cropId, officerName, advice],
(err)=>{
if(err){
return res.json({message:"Failed to save advice"});
}

/* Update request status */
db.query(
"UPDATE requests SET status='solved' WHERE id=?",
[cropId],
(err2)=>{
if(err2){
return res.json({message:"Advice saved but status not updated"});
}

res.json({message:"Advice saved successfully"});
});

});

});

/* Start Server */

app.listen(5000,()=>{
    console.log("Server running on http://localhost:5000");
});
