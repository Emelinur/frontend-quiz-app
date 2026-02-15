// import { getData } from "./helpers";
const themaSelect = document.querySelector("#theme-toggle");

themaSelect.addEventListener("change",  (e) => {
const selectedThema = e.target.checked

selectedThema ? document.body.classList.add("dark") : document.body.classList.remove("dark");
localStorage.setItem("selectedThema", selectedThema);
});


