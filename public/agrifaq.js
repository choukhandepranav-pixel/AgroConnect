let faq = document.querySelectorAll(".faq");

faq.forEach(item => {

item.addEventListener("click", ()=>{

item.classList.toggle("active");

let ans = item.querySelector(".answer");

if(ans.style.display === "block"){
ans.style.display = "none";
}
else{
ans.style.display = "block";
}

});

});
function scrollSection(section){

if(section === "all"){

window.scrollTo({
top:0,
behavior:"smooth"
});

return;
}

document.getElementById(section).scrollIntoView({

behavior:"smooth"

});

}
function scrollSection(section){

if(section === "all"){

window.scrollTo({
top:0,
behavior:"smooth"
});

return;

}

document.getElementById(section).scrollIntoView({

behavior:"smooth",
block:"start"

});

}