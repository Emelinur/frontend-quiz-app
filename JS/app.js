// import { getData } from "./helpers";
const themaSelect = document.querySelector("#theme-toggle");
const sunIcon = document.querySelector("#sun-icon");
const moonIcon = document.querySelector("#moon-icon");

themaSelect.addEventListener("change",  (e) => {
const selectedThema = e.target.checked
if(selectedThema){

document.body.classList.add("dark");
sunIcon.classList.remove("thema-sun-icon");
sunIcon.classList.add("thema-sun-icon-dark");
moonIcon.classList.remove("thema-moon-icon");
moonIcon.classList.add("thema-moon-icon-dark");


} else {
document.body.classList.remove("dark");
sunIcon.classList.remove("thema-sun-icon-dark");
sunIcon.classList.add("thema-sun-icon");
moonIcon.classList.remove("thema-moon-icon-dark");
moonIcon.classList.add("thema-moon-icon");
}
localStorage.setItem("quiz-theme", e.target.checked ? "dark" : "light");
});

