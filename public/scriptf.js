// Base URL for API (same origin when served from server)
const API_BASE = "";

// RUN WHEN PAGE LOADS - USER SPECIFIC
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("agroUser") || "null");
  if (user) {
    // AUTO-FILL FARMER DETAILS FROM LOGIN
    const nameEl = document.querySelector("input[name='farmerName']");
    const villageEl = document.querySelector("input[name='village']");
    const mobileEl = document.getElementById("mobile");
    if (nameEl) nameEl.value = user.name;
    if (villageEl) villageEl.value = user.location;
    if (mobileEl) mobileEl.value = user.mobile;
    document.getElementById("farmerName").textContent = user.name;
  }

const form = document.getElementById("issueForm");

if (form) {

form.addEventListener("submit", function (e) {

e.preventDefault();

const user = JSON.parse(localStorage.getItem("agroUser") || "null");
if (!user) {
  alert("Please login first");
  window.location.href = "login.html";
  return;
}

const name = document.querySelector("input[name='farmerName']").value.trim();
const village = document.querySelector("input[name='village']").value.trim();
const mobile = document.getElementById("mobile").value.trim();
const cropSelect = document.getElementById("cropSelect").value;
const cropName = cropSelect === "Other" ? (document.getElementById("otherCrop").value || "Other").trim() : cropSelect;
const cropProblem = document.getElementById("issueText").value.trim();
const fileInput = document.getElementById("cropImage");

if (!name || !village || !mobile || !cropName || !cropProblem) {

alert("Please fill all required fields.");

return;

}

const fd = new FormData();

// fd.append("user_id", user.id);  // REMOVED: not used in backend
fd.append("farmerName", name);
fd.append("village", village);
fd.append("mobile", mobile);
fd.append("cropName", cropName);
fd.append("cropProblem", cropProblem);
if (fileInput && fileInput.files && fileInput.files[0]) {
  fd.append("cropImage", fileInput.files[0]);
}

fetch(API_BASE + "/api/upload", {
method: "POST",
body: fd
})
.then(res => res.json())
.then(data => {
if (data.message && data.message.includes("Successfully")) {
  localStorage.setItem("farmerMobile", mobile);
  alert(data.message);
  form.reset();
  document.getElementById("previewImage").style.display = "none";
  loadRequestsFromServer();
} else {
  alert(data.message || "Submission failed.");
}
})
.catch(() => alert("Network error. Please try again."));
});

}


loadRequestsFromServer();

});


// PROFILE DROPDOWN
function toggleProfile(){
document.getElementById("profileDropdown").classList.toggle("show");
}


// LOGOUT
function logout(){
alert("Logged out");
window.location.href="login.html";
}


// SIDEBAR SECTION SWITCH
function showSection(section, element) {

document.querySelectorAll(".section")

.forEach(sec => sec.classList.remove("active"));

document.getElementById(section).classList.add("active");

document.querySelectorAll(".menu li")

.forEach(li => li.classList.remove("active"));

if (element) element.classList.add("active");

window.scrollTo({ top: 0, behavior: "smooth" });

if (section === "requests") loadRequestsFromServer();

if (section === "consultant") loadAdvice();

}


// LOAD REQUESTS - USER SPECIFIC
function loadRequestsFromServer() {
  const user = JSON.parse(localStorage.getItem("agroUser") || "null");
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  fetch(API_BASE + "/api/my-requests?mobile=" + encodeURIComponent(user.mobile))
    .then(res => res.json())
    .then(requests => {
      const table = document.getElementById("requestTable");
      if (!table) return;

      table.innerHTML = `
        <tr>
          <th>Name</th><th>Village</th><th>Crop</th><th>Issue</th><th>Status</th>
        </tr>
      `;

      requests.forEach(r => {
        const row = table.insertRow();
        row.innerHTML = `
          <td>${r.farmerName || ""}</td>
          <td>${r.village || ""}</td>
          <td>${r.cropName || ""}</td>
          <td>${r.cropProblem?.substring(0,50) || ""}${r.cropProblem && r.cropProblem.length > 50 ? '...' : ''}</td>
          <td><span class="status ${r.status || 'pending'}">${r.status || "pending"}</span></td>
        `;
      });

      const totalEl = document.getElementById("totalIssues");
      const pendingEl = document.getElementById("pendingIssues");
      if (totalEl) totalEl.innerText = requests.length;
      if (pendingEl) pendingEl.innerText = requests.filter(r => (r.status || "").toLowerCase() !== "solved").length;
    })
    .catch(() => {
      const totalEl = document.getElementById("totalIssues");
      if (totalEl) totalEl.innerText = "0";
    });
}



// TOGGLE REVIEW FORM
function toggleReviewForm(){

const form = document.getElementById("reviewForm");

if(form.style.display === "grid"){
form.style.display = "none";
}else{
form.style.display = "grid";
}

}


// ADD REVIEW
function addReview(){

const farmer = document.getElementById("reviewFarmer").value;
const village = document.getElementById("reviewVillage").value;
const issue = document.getElementById("reviewIssue").value;
const status = document.getElementById("reviewStatus").value;

if(!farmer || !village || !issue){
alert("Please fill all fields");
return;
}

const table = document.getElementById("reviewTable");

const row = table.insertRow();

row.innerHTML = `
<td>${farmer}</td>
<td>${village}</td>
<td>${issue}</td>
<td>${status}</td>
`;

document.getElementById("reviewFarmer").value = "";
document.getElementById("reviewVillage").value = "";
document.getElementById("reviewIssue").value = "";

alert("Review added successfully!");

}
/* OTP SYSTEM */

let generatedOTP = "";


function sendOTP(){

const mobile = document.getElementById("mobile").value;

if(mobile.length !== 10){

alert("Enter valid 10 digit mobile number");

return;

}

/* generate random OTP */

generatedOTP = Math.floor(100000 + Math.random() * 900000);

alert("OTP Sent: " + generatedOTP);

/* show message */

document.getElementById("message").innerText = 
"OTP sent to " + mobile;

}


function verifyOTP(){

const userOTP = document.getElementById("otp").value;

if(userOTP == generatedOTP){

document.getElementById("message").style.color = "green";

document.getElementById("message").innerText = 
"OTP Verified Successfully";

}
else{

document.getElementById("message").style.color = "red";

document.getElementById("message").innerText = 
"Invalid OTP";

}

}
function toggleOtherCrop(){

const crop = document.getElementById("cropSelect").value;
const other = document.getElementById("otherCrop");

if(crop === "Other"){
other.style.display = "block";
}else{
other.style.display = "none";
other.value="";
}

}
// Load Agriculture Consultant advice from backend
function loadAdvice() {

const table = document.getElementById("adviceTable");

if (!table) return;

  const user = JSON.parse(localStorage.getItem("agroUser") || "null");
  const mobile = user ? user.mobile : localStorage.getItem("farmerMobile");

  const url = mobile ? API_BASE + "/api/advice?mobile=" + encodeURIComponent(mobile) : API_BASE + "/api/advice";

fetch(url)

.then(res => res.json())

.then(list => {

table.innerHTML = `

<tr>

<th>Officer</th>

<th>Crop</th>

<th>Advice</th>

<th>Date</th>

</tr>

`;

(list || []).forEach(a => {

const row = table.insertRow();

const date = a.created_at ? new Date(a.created_at).toLocaleDateString() : "";

row.innerHTML = `

<td>${a.officer_name || ""}</td>

<td>${a.cropName || ""}</td>

<td>${a.advice || ""}</td>

<td>${date}</td>

`;

});

})

.catch(() => {

table.innerHTML = `

<tr><th>Officer</th><th>Crop</th><th>Advice</th><th>Date</th></tr>

<tr><td colspan="4">Could not load advice.</td></tr>

`;

});

}

const cropImageEl = document.getElementById("cropImage");

if (cropImageEl) cropImageEl.addEventListener("change", function () {

const file = this.files[0];
const preview = document.getElementById("previewImage");

if(file){
preview.src = URL.createObjectURL(file);
preview.style.display = "block";
}

});
