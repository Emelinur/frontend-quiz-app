import { getData } from "./helpers.js";
const themaSelect = document.querySelector("#theme-toggle");
const btnCategory = document.querySelectorAll("#btnCategory");
const quizScreen = document.querySelector("#quiz-screen");
const startMenu = document.querySelector("#start-menu");
const activeCategory = document.querySelector("#active-category");
const optionsList = document.querySelector("#options-list");
const submitBtn = document.querySelector("#submitBtn");
const emptyMessage = document.querySelector(".empty-message");
const currentNum = document.querySelector("#current-num");
themaSelect.addEventListener("change", (e) => {
  const selectedThema = e.target.checked;
  selectedThema
    ? document.body.classList.add("dark")
    : document.body.classList.remove("dark");
  localStorage.setItem("selectedThema", selectedThema);
});
let selectedQuiz = null;
let selectedAnswer = null;
let score = 0;
optionsList.addEventListener("click", (e) => {
  const clickedBtn = e.target.closest(".btn");
  if (clickedBtn && !clickedBtn.classList.contains("disabled")) {
    emptyMessage.style.display = "none";
    const allBtns = optionsList.querySelectorAll(".btn");
    allBtns.forEach((btn) => {
      btn.classList.remove("selected");
    });
    clickedBtn.classList.add("selected");
    selectedAnswer = clickedBtn.getAttribute("data-option");
  }
});
let currentQuestionIndex = 0;
submitBtn.addEventListener("click", () => {
  const questions = selectedQuiz.questions;
  if (submitBtn.textContent === "Next Question") {
    startTimer()
   const timeoutLabel = document.querySelector("#time-out");
    if (timeoutLabel) {
        timeoutLabel.style.display = "none";
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      currentNum.innerText = currentQuestionIndex + 1;
      const nextQuestion = questions[currentQuestionIndex];
      renderQuestion(nextQuestion);
      renderOptions(nextQuestion.options);
      console.log(currentNum.innerText);
      submitBtn.textContent = "Submit Answer";
      selectedAnswer = null;
    } else {
        handleTimeOut() 
      showResult();
    }
    return;
  }

  if (!selectedAnswer) {
    emptyMessage.style.display = "flex";
    return;
  }

  emptyMessage.style.display = "none";
  const correctAnswer = questions[currentQuestionIndex].answer;
  const currentBtn = document.querySelector(".btn.selected");
  const allBtns = optionsList.querySelectorAll(".btn");

  if (selectedAnswer === correctAnswer) {
    currentBtn.classList.add("correct");
    score++;
  } else {
    currentBtn.classList.add("error");
    if (score > 0) score--;
 
    allBtns.forEach((btn) => {
      if (btn.getAttribute("data-option") === correctAnswer) {
        btn.classList.add("show-correct");
       
      }
    });
  }
  allBtns.forEach((btn) => btn.classList.add("disabled"));
  submitBtn.textContent = "Next Question";
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
      startMenu.classList.add("hidden");
      quizScreen.classList.remove("hidden");
      activeCategory.classList.remove("hidden");
      activeCategory.querySelector("img").src = selectedQuiz.icon;
      activeCategory.querySelector("#header-text").textContent =
        selectedQuiz.title;
      renderQuestion(selectedQuiz.questions[0]);
      renderOptions(selectedQuiz.questions[0].options);
         startTimer()
 
    }
  });
});
function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
}
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
            <span class="empty"></span>
          </button>
`;
    })
    .join("");
  optionsContainer.innerHTML = optionsHTML;
}

//Timer
let timeLeft = 100; 
let timerInterval;

function startTimer() {
  const progressBar = document.querySelector("#quiz-progress");
  clearInterval(timerInterval);
  timeLeft = 100;

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    progressBar.value = timeLeft;
    
    // CSS'deki rengi güncelle (Senior Dokunuşu)
    progressBar.style.setProperty('--progress', `${timeLeft}%`);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 100);
}
function handleTimeOut() {
  const timeoutLabel = document.querySelector("#time-out");
  const questions = selectedQuiz.questions;
  const correctAnswer = questions[currentQuestionIndex].answer;
  const allBtns = optionsList.querySelectorAll(".btn");

  clearInterval(timerInterval);

  timeoutLabel.style.display = "block";
  timeoutLabel.textContent = "Time's Up!";

  allBtns.forEach((btn) => {
    btn.classList.add("disabled");
    if (btn.getAttribute("data-option") === correctAnswer) {
      btn.classList.add("show-correct");
    }
  });

  submitBtn.textContent = "Next Question";
  selectedAnswer = "timeout"; 
}