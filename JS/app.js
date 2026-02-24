import { getData } from "./helpers.js";
const themaSelect = document.querySelector("#theme-toggle");
const btnCategory = document.querySelectorAll("#btnCategory");
const quizScreen = document.querySelector("#quiz-screen");
const startMenu = document.querySelector("#start-menu");
const activeCategory = document.querySelector("#active-category");
const optionsList = document.querySelector("#options-list");
const submitBtn = document.querySelector("#submitBtn");

themaSelect.addEventListener("change", (e) => {
  const selectedThema = e.target.checked;
  selectedThema
    ? document.body.classList.add("dark")
    : document.body.classList.remove("dark");
  localStorage.setItem("selectedThema", selectedThema);
});
let selectedQuiz = null;
let selectedAnswer = null;
optionsList.addEventListener("click", (e) => {
  const clickedBtn = e.target.closest(".btn");
  if (clickedBtn) {
    const allBtns = optionsList.querySelectorAll(".btn");
    allBtns.forEach((btn) => {
      btn.classList.remove("selected");
        submitBtn.addEventListener("click", () => {
    const Btns = optionsList.querySelectorAll(".btn");
    Btns.forEach((btn) => {
      btn.classList.remove("selected");
    });
    console.log(selectedQuiz.questions[0].answer)
    if (selectedAnswer === selectedQuiz.questions[0].answer) {
      
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });
    });
    clickedBtn.classList.add("selected");
    selectedAnswer = clickedBtn.getAttribute("data-option");
  }

});

btnCategory.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const categoryName = e.currentTarget
      .querySelector(".btnCategoriValue")
      .textContent.trim()
      .toUpperCase();
    const allData = await getData();
    selectedQuiz = allData.quizzes.find(
      (quiz) => quiz.title.toUpperCase() === categoryName,
    );

    if (selectedQuiz) {
      console.log(`${categoryName} selected`);
      startMenu.classList.add("hidden");
      quizScreen.classList.remove("hidden");
      activeCategory.classList.remove("hidden");
      activeCategory.querySelector("img").src = selectedQuiz.icon;
      activeCategory.querySelector("#header-text").textContent =
        selectedQuiz.title;
      renderQuestion(selectedQuiz.questions[0]);
      renderOptions(selectedQuiz.questions[0].options);
    }
  });
});

function renderQuestion(questionData) {
  //Ouestions
  const questionText = document.querySelector("#questionText");
  if (questionText) {
    questionText.textContent = questionData.question;
  }
}

function renderOptions(options) {
  //options
  const optionsContainer = document.querySelector("#options-list");
  const optionsHTML = options
    .map((option, index) => {
      const letter = String.fromCharCode(65 + index);
      return `
<button class="btn bg-color-white btn-bg-color" type="button" data-option="${option}">
            <span class="fs-s quiz-menu-char fs-s-mobile">${letter}</span>
            <span class="fs-s fw-medium fs-s-mobile text-color">${option}</span>
          </button>
`;
    })
    .join("");
  optionsContainer.innerHTML = optionsHTML;
}
