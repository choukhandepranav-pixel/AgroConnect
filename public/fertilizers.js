let selectedFertilizers = [];
let generatedOTP = "1234";

function showRecommendation(){

let crop = document.getElementById("cropSelect").value;
let box = document.getElementById("recommendation");

box.innerHTML="";
selectedFertilizers=[];

if(crop==="rice"){

box.innerHTML=`

<div class="fert-card" onclick="toggleFertilizer(this,'Urea')">
<h3>Urea</h3>
<p>Best for rice growth</p>
</div>

<div class="fert-card" onclick="toggleFertilizer(this,'DAP')">
<h3>DAP</h3>
<p>Improves root development</p>
</div>

`;

}

if(crop==="wheat"){

box.innerHTML=`

<div class="fert-card" onclick="toggleFertilizer(this,'Urea')">
<h3>Urea</h3>
<p>Boosts wheat growth</p>
</div>

<div class="fert-card" onclick="toggleFertilizer(this,'NPK 20-20-20')">
<h3>NPK 20-20-20</h3>
<p>Balanced nutrients</p>
</div>

`;

}

if(crop==="cotton"){

box.innerHTML=`

<div class="fert-card" onclick="toggleFertilizer(this,'DAP')">
<h3>DAP</h3>
<p>Strong root development</p>
</div>

<div class="fert-card" onclick="toggleFertilizer(this,'NPK 19-19-19')">
<h3>NPK 19-19-19</h3>
<p>Balanced fertilizer</p>
</div>

`;

}

if(crop==="soybean"){

box.innerHTML=`

<div class="fert-card" onclick="toggleFertilizer(this,'DAP')">
<h3>DAP</h3>
<p>Good for soybean roots</p>
</div>

<div class="fert-card" onclick="toggleFertilizer(this,'Potash')">
<h3>Potash</h3>
<p>Improves seed quality</p>
</div>

`;

}

}

function toggleFertilizer(card,name){

card.classList.toggle("selected");

if(selectedFertilizers.includes(name)){

selectedFertilizers = selectedFertilizers.filter(f=>f!==name);

}else{

selectedFertilizers.push(name);

}

if(selectedFertilizers.length>0){

document.getElementById("orderBtn").style.display="block";

}else{

document.getElementById("orderBtn").style.display="none";

}

}

function openOrder(){

document.getElementById("orderSection").style.display="block";

let listHTML="<h3>Selected Fertilizers</h3>";

selectedFertilizers.forEach(function(fert){

listHTML+=`

<div>
<b>${fert}</b><br>
<label>Quantity (bags)</label>
<input type="number" min="1" value="1" class="fertQty" data-name="${fert}">
</div><br>

`;

});

document.getElementById("fertList").innerHTML=listHTML;

}

function sendOTP(){

alert("OTP sent to mobile number. Demo OTP: 1234");

}

function placeOrder(){

let otp=document.getElementById("otp").value;

if(otp!==generatedOTP){

alert("Incorrect OTP");
return;

}

let name=document.getElementById("name").value;

let orderDetails=[];

document.querySelectorAll(".fertQty").forEach(function(input){

let fertName=input.dataset.name;
let qty=input.value;

orderDetails.push(fertName+" ("+qty+" bags)");

});

document.getElementById("result").innerHTML=

"✅ Order Placed Successfully<br><br>"+
"Farmer: "+name+"<br>"+
"Fertilizers Ordered:<br>"+
orderDetails.join("<br>")+"<br><br>"+
"📦 Delivery date will be assigned by Krushi Adhikari";

}