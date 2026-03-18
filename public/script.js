/* =========================
   AGROCONNECT MAIN SCRIPT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    handleFarmerForm();
    loadProfile();
    previewImage();
    handleNavbar();

    // Apply saved language
    applySavedLanguage();

});


/* =========================
   FARMER FORM SUBMIT
========================= */

function handleFarmerForm(){
const farmerForm = document.getElementById("farmerForm");

if(!farmerForm) return;

farmerForm.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(farmerForm);

try{
await fetch("/api/upload",{
method:"POST",
body:formData
});

document.getElementById("uploadResult").innerText =
"✅ Request sent to Krushi Adhikari!";

farmerForm.reset();

}catch(error){
console.error("Upload error:",error);
}

});
}


/* =========================
   LOAD PROFILE DATA
========================= */

function loadProfile(){
const user = JSON.parse(localStorage.getItem("agroUser"));

if(!user) return;

const welcome = document.getElementById("welcomeText");

if(welcome){
welcome.innerText = "Welcome, " + user.name + " 👋";
}
}


/* =========================
   IMAGE PREVIEW
========================= */

function previewImage(){

const imageInput = document.getElementById("cropImage");
const preview = document.getElementById("preview");

if(!imageInput || !preview) return;

imageInput.addEventListener("change", function(){

const file = this.files[0];

if(file){
preview.src = URL.createObjectURL(file);
preview.style.display="block";
}

});
}


/* =========================
   NAVBAR PROFILE SYSTEM
========================= */

function handleNavbar(){

const user = JSON.parse(localStorage.getItem("agroUser"));

const navButtons = document.getElementById("navButtons");
const profileMenu = document.getElementById("profileMenu");
const profileImg = document.getElementById("profileImg");
const dropdown = document.getElementById("dropdownMenu");
const logoutBtn = document.getElementById("logoutBtn");
const upload = document.getElementById("profileUpload");

if(user){

if(navButtons) navButtons.style.display="none";
if(profileMenu) profileMenu.style.display="block";

const farmerLink = document.querySelector("a[href='farmer.html']");
const krushiLink = document.querySelector("a[href='krushi.html']");

if(user.role === "farmer" && krushiLink){
krushiLink.style.display = "none";
}

if(user.role === "krushi" && farmerLink){
farmerLink.style.display = "none";
}
}

/* dropdown */
if(profileImg && dropdown){

profileImg.addEventListener("click", () => {
dropdown.classList.toggle("show");
});

document.addEventListener("click", (e)=>{
if(!e.target.closest(".profile-menu")){
dropdown.classList.remove("show");
}
});
}

/* logout */
if(logoutBtn){
logoutBtn.addEventListener("click", ()=>{
localStorage.clear();
window.location.href="index.html";
});
}

/* profile photo */
if(profileImg){
const savedPhoto = localStorage.getItem("profilePhoto");
if(savedPhoto){
profileImg.src = savedPhoto;
}
}

/* upload photo */
if(upload){
upload.addEventListener("change", function(){
const file = this.files[0];

if(file){
const reader = new FileReader();
reader.onload = (e)=>{
profileImg.src = e.target.result;
localStorage.setItem("profilePhoto", e.target.result);
}
reader.readAsDataURL(file);
}
});
}

}


/* =========================
   CHART
========================= */

document.addEventListener("DOMContentLoaded", function(){

const ctx = document.getElementById('farmChart');

if(ctx){
new Chart(ctx, {
type: 'line',
data: {
labels: ['Jan','Feb','Mar','Apr','May','Jun'],
datasets: [{
label: 'Crop Health (%)',
data: [60,75,80,70,90,95],
fill:true,
backgroundColor: 'rgba(76,175,80,0.2)',
borderColor: '#4CAF50',
borderWidth:3,
tension:0.4
}]
}
});
}

});


/* =========================
   WEATHER
========================= */

const apiKey = "f650f3c1d9a87e5e4778791b748fc28f";

async function getWeather(){

const city = document.getElementById("cityInput").value.trim();

if(!city){
alert("Enter city name");
return;
}

try{
const res = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
);

const data = await res.json();

if(data.cod !== 200){
alert("City not found");
return;
}

showWeather(data);

}catch(err){
console.log(err);
alert("Weather error");
}
}


function getLocationWeather(){

if(!navigator.geolocation){
alert("Geolocation not supported");
return;
}

navigator.geolocation.getCurrentPosition(async (position)=>{

const lat = position.coords.latitude;
const lon = position.coords.longitude;

try{
const res = await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
);

const data = await res.json();

showWeather(data);

}catch(error){
alert("Weather error");
}

}, ()=>{
alert("Location permission denied");
});
}


function showWeather(data){

document.getElementById("temp").innerText =
Math.round(data.main.temp) + "°C";

document.getElementById("condition").innerText =
data.weather[0].main;

document.getElementById("humidity").innerText =
data.main.humidity + "%";

document.getElementById("wind").innerText =
data.wind.speed + " km/h";
}


/* =========================
   MENU
========================= */

function toggleMenu(){
document.getElementById("navMenu").classList.toggle("active");
}


/* =========================
   🌐 LANGUAGE SYSTEM (FIXED)
========================= */

const translations = {

en: {
nav_home: "Home",
nav_farmer: "Farmer",
nav_krushi: "Krushi Adhikari",
nav_fertilizers: "Fertilizers",
nav_faq: "FAQ",
hero_title: "Smart Agriculture Help System",
hero_desc: "Upload crop problems and get expert advice instantly.",
get_started: "Get Started"
},

hi: {
nav_home: "होम",
nav_farmer: "किसान",
nav_krushi: "कृषि अधिकारी",
nav_fertilizers: "उर्वरक",
nav_faq: "सामान्य प्रश्न",
hero_title: "स्मार्ट कृषि सहायता प्रणाली",
hero_desc: "फसल की समस्या अपलोड करें और विशेषज्ञ सलाह प्राप्त करें।",
get_started: "शुरू करें"
},

mr: {
nav_home: "मुख्यपृष्ठ",
nav_farmer: "शेतकरी",
nav_krushi: "कृषी अधिकारी",
nav_fertilizers: "खते",
nav_faq: "प्रश्नोत्तरे",
hero_title: "स्मार्ट शेती सहाय्य प्रणाली",
hero_desc: "पीक समस्या अपलोड करा आणि तज्ञांचा सल्ला मिळवा.",
get_started: "सुरू करा"
}

};


function changeLanguage(lang){

const elements = document.querySelectorAll("[data-key]");

elements.forEach(el=>{
const key = el.getAttribute("data-key");

if(translations[lang][key]){
el.innerText = translations[lang][key];
}
});

localStorage.setItem("language", lang);
}


function applySavedLanguage(){

const savedLang = localStorage.getItem("language") || "en";

const switcher = document.getElementById("languageSwitcher");

if(switcher){
switcher.value = savedLang;
}

changeLanguage(savedLang);
}
