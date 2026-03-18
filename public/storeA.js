/* OTP GENERATION */

let generatedOTP = "1234";

function sendOTP(){
alert("OTP sent successfully. Demo OTP: 1234");
}


/* STORE REGISTRATION */

function registerStore(){

let name = document.getElementById("name")?.value;
let mobile = document.getElementById("mobile")?.value;
let email = document.getElementById("email")?.value;
let otp = document.getElementById("otp")?.value;
let agree = document.getElementById("agree")?.checked;

if(!name || !mobile || !email){
alert("Please fill all details");
return;
}

if(otp !== generatedOTP){
alert("Invalid OTP");
return;
}

if(!agree){
alert("Please accept terms and conditions");
return;
}

let store = {
name:name,
mobile:mobile,
email:email
};

localStorage.setItem("storeUser",JSON.stringify(store));

let msg=document.getElementById("msg");
if(msg){
msg.innerText="Registration Successful";
}

setTimeout(function(){
window.location.href="storeL.html";
},2000);

}


/* STORE LOGIN */

function loginStore(){

let email=document.getElementById("loginEmail")?.value;
let mobile=document.getElementById("loginMobile")?.value;

let store=JSON.parse(localStorage.getItem("storeUser"));

if(store && store.email===email && store.mobile===mobile){

window.location.href="storep.html";

}else{

let loginMsg=document.getElementById("loginMsg");
if(loginMsg){
loginMsg.innerText="Invalid Login Details";
}

}

}


/* LOAD STORE PROFILE */

let store=JSON.parse(localStorage.getItem("storeUser"));

if(store){

document.getElementById("pname")?.innerText=store.name;
document.getElementById("pmobile")?.innerText=store.mobile;
document.getElementById("pemail")?.innerText=store.email;

}


/* LOGOUT FUNCTION */

function logoutStore(){

localStorage.removeItem("storeUser");
window.location.href="storeL.html";

}


/* LOAD FARMER ORDERS + BILL */

let orderList=document.getElementById("orderList");
let billBox=document.getElementById("bill");

if(orderList && billBox){

let orders=JSON.parse(localStorage.getItem("fertOrders")) || [];

let total=0;

if(orders.length===0){

orderList.innerHTML="<p>No farmer orders yet</p>";
billBox.innerHTML="<b>Total Amount: ₹0</b>";

}else{

orders.forEach(function(order){

let price=500;
let cost=price*(order.qty || 1);

total+=cost;

orderList.innerHTML+=`

<div class="order-card">

<p><b>Farmer Name:</b> ${order.name}</p>
<p><b>Mobile:</b> ${order.mobile}</p>
<p><b>Address:</b> ${order.address}</p>

<p><b>Fertilizer:</b> ${order.fertilizer}</p>
<p><b>Quantity:</b> ${order.qty}</p>

</div>

`;

billBox.innerHTML+=`

<p>${order.fertilizer} (${order.qty}) = ₹${cost}</p>

`;

});

billBox.innerHTML+=`

<hr>
<h3>Total Amount: ₹${total}</h3>

`;

}

}