import { getData } from "./helpers.js";
const themaSelect = document.querySelector("#theme-toggle");
const btnCategory = document.querySelectorAll("#btnCategory");
const btnCategoriValue=document.querySelector(".btnCategoriValue")
let quizData = [];

themaSelect.addEventListener("change",  (e) => {
const selectedThema = e.target.checked
selectedThema ? document.body.classList.add("dark") : document.body.classList.remove("dark");
localStorage.setItem("selectedThema", selectedThema);
});

btnCategory.forEach((btn)=>{
btn.addEventListener("click",()=>{
const categoryName = btn.querySelector(".btnCategoriValue").textContent.trim();
console.log(categoryName)
})
})



console.log(getData());