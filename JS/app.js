// import { getData } from "./helpers";
const themaSelect = document.querySelector("#theme-toggle");

themaSelect.addEventListener("change",  (e) => {
const selectedThema = e.target.checked
if(selectedThema){

document.body.classList.add("dark");

} else {

document.body.classList.remove("dark");

}
});



  // const selectedThema = e.target.checked ? "dark" : "light";
  // selectedThema === "dark" ? document.documentElement.setAttribute("data-theme", "dark") : document.documentElement.removeAttribute("data-theme");
  // console.log("Selected thema:", selectedThema); 

