function showSection(sectionId){

const sections = document.querySelectorAll(".section");

sections.forEach(section=>{
section.style.display="none";
});

document.getElementById(sectionId).style.display="block";

if(sectionId === "reports"){
loadReportGraph();
loadCropGraph();
}

}   // ✅ IMPORTANT closing bracket

// LOAD FARMER REQUESTS FROM SERVER

function loadRequests(){

fetch("http://localhost:5000/api/requests")
.then(res => res.json())
.then(data => {

const pendingContainer = document.querySelector(".farmer-container");
const solvedContainer = document.querySelector("#solved .solved-container");

if(!pendingContainer || !solvedContainer) return;

pendingContainer.innerHTML = "";
solvedContainer.innerHTML = "";

data.forEach(farmer => {

const imgSrc = farmer.image ? "http://localhost:5000/uploads/" + farmer.image : "";
const status = (farmer.status || "pending").toLowerCase();

if(status === "solved"){

solvedContainer.innerHTML += `
<div class="farmer-card" data-crop="${farmer.cropName || ""}" data-crop-id="${farmer.id}">

<h3 class="farmer-name">${farmer.farmerName}</h3>

<span class="status solved">Solved</span>

<p><b>Village:</b> ${farmer.village}</p>

<p><b>Mobile:</b> ${farmer.mobile}</p>

<p><b>Crop:</b> ${farmer.cropName}</p>

<p><b>Problem:</b> ${farmer.cropProblem}</p>

${imgSrc ? '<img src="' + imgSrc + '" width="150" alt="Crop">' : ""}

</div>
`;

} else {

pendingContainer.innerHTML += `
<div class="farmer-card" data-crop="${farmer.cropName || ""}" data-crop-id="${farmer.id}">

<h3 class="farmer-name">${farmer.farmerName}</h3>

<span class="status pending">Pending</span>

<p><b>Village:</b> ${farmer.village}</p>

<p><b>Mobile:</b> ${farmer.mobile}</p>

<p><b>Crop:</b> ${farmer.cropName}</p>

<p><b>Problem:</b> ${farmer.cropProblem}</p>

${imgSrc ? '<img src="' + imgSrc + '" width="150" alt="Crop">' : ""}

<input type="text" placeholder="Write advice / solution" class="advice-input">

<button onclick="sendAdvice(this)">Send Advice</button>

</div>
`;

}

});

updateStats();

});

}



// SEND ADVICE – save to backend (Agriculture Consultant) and mark request solved
function sendAdvice(button) {

const card = button.parentElement;

const cropId = card.getAttribute("data-crop-id");

const solution = (card.querySelector("input") || card.querySelector(".advice-input")).value.trim();

if (!solution) {

alert("Write advice/solution first");

return;

}

if (!cropId) {

alert("Request ID missing. Reload the page.");

return;

}

fetch("http://localhost:5000/api/advice", {

method: "POST",

headers: { "Content-Type": "application/json" },

body: JSON.stringify({ cropId: parseInt(cropId, 10), officerName: "Krushi Adhikari", advice: solution })

})

.then(res => res.json())

.then(data => {

if (data.message && data.message.includes("successfully")) {

// reload both Pending & Solved lists from server
loadRequests();

alert("Advice sent and saved. Farmer will see it in Agriculture Consultant.");

} else {

alert(data.message || "Failed to save advice.");

}

})

.catch(() => alert("Network error. Could not save advice."));

}

// UPDATE DASHBOARD STATS

function updateStats(){

const pending = document.querySelectorAll(".farmer-container .farmer-card").length;
const solved = document.querySelectorAll(".solved-container .farmer-card").length;
const total = pending + solved;

document.getElementById("pendingCount").innerText = pending;
document.getElementById("solvedCount").innerText = solved;
document.getElementById("totalFarmers").innerText = total;

document.getElementById("reportTotal").innerText = total;
document.getElementById("reportPending").innerText = pending;
document.getElementById("reportSolved").innerText = solved;


loadReportGraph();   // update graph automatically

}


// SEARCH FARMER

function searchFarmer(){

const input = document.getElementById("searchInput").value.toLowerCase();

const cards = document.querySelectorAll(".farmer-card");

cards.forEach(card=>{

const name = card.querySelector(".farmer-name").innerText.toLowerCase();

if(name.includes(input)){
card.style.display = "block";
}else{
card.style.display = "none";
}

});

}



// FILTER BY CROP

function filterCrop(){

const selected = document.getElementById("cropFilter").value;

const cards = document.querySelectorAll(".farmer-card");

cards.forEach(card=>{

const crop = card.getAttribute("data-crop");

if(selected === "all" || crop === selected){
card.style.display = "block";
}else{
card.style.display = "none";
}

});

}



// LOAD DATA WHEN PAGE OPENS

window.onload = function(){
loadRequests();
};
// REPORT
let reportChart;

function loadReportGraph(){

const pending = document.querySelectorAll(".farmer-container .farmer-card").length;
const solved = document.querySelectorAll(".solved-container .farmer-card").length;

const ctx = document.getElementById("reportChart");

if(!ctx) return;

if(reportChart){
reportChart.destroy();
}

reportChart = new Chart(ctx,{
type:'bar',
data:{
labels:['Pending Complaints','Solved Complaints'],
datasets:[{
label:'Complaint Statistics',
data:[pending, solved],
backgroundColor:['orange','#22c55e']
}]
},
options:{
plugins:{
legend:{labels:{color:'white'}}
},
scales:{
x:{ticks:{color:'white'}},
y:{ticks:{color:'white'}}
}
}
});

}

function toggleProfile() {
  const menu = document.getElementById("profileDropdown");
  menu.classList.toggle("show");
}

// Close dropdown if clicked outside
window.onclick = function(e) {
  if (!e.target.closest(".profile")) {
    document.getElementById("profileDropdown").classList.remove("show");
  }
}

// Load user name
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("agroUser"));
  if (user) {
    document.getElementById("username").innerText = user.name || "Officer";
  }
});

// Logout
function logout() {
  localStorage.removeItem("agroUser");
  window.location.href = "login.html";
}

// Profile page
function goProfile() {
  alert("Profile page coming soon 🚀");
}
const user = JSON.parse(localStorage.getItem("agroUser"));
if (user && user.photo) {
  document.getElementById("profileImage").src = user.photo;
}

document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("agroUser"));

  if (user) {

    // ✅ Show name in navbar
    document.getElementById("username").innerText = user.name || "Officer";

    // ✅ Show name in dropdown
    document.getElementById("dropdownName").innerText = "👤 " + (user.name || "Officer");

    // ✅ Show profile image
    if (user.photo) {
      document.getElementById("profileImage").src = user.photo;
    }

  }

});
function toggleProfile() {
  document.getElementById("profileDropdown").classList.toggle("show");
}

window.onclick = function(e) {
  if (!e.target.closest(".profile")) {
    document.getElementById("profileDropdown").classList.remove("show");
  }
}