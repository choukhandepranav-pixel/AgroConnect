function searchFertilizer(){

let input=document.getElementById("search").value.toLowerCase();
let rows=document.querySelectorAll("#fertilizerTable tbody tr");

rows.forEach(function(row){

let name=row.cells[0].innerText.toLowerCase();

if(name.includes(input)){
row.style.display="";
}else{
row.style.display="none";
}

});

}

function provideFertilizer(name){

localStorage.setItem("fertilizerName",name);

window.location.href="store.html";

}