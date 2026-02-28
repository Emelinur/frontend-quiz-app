import { getData } from "./helpers.js";

// ========== DOM Elements Cache ==========
const themeToggle = document.querySelector("#theme-toggle");
const categoryButtons = document.querySelectorAll("#btnCategory");
const quizScreen = document.querySelector("#quiz-screen");
const startMenu = document.querySelector("#start-menu");
const activeCategory = document.querySelector("#active-category");
const optionsList = document.querySelector("#options-list");
const submitBtn = document.querySelector("#submitBtn");
const emptyMessage = document.querySelector(".empty-message");
const currentNum = document.querySelector("#current-num");
const quizCompleted = document.querySelector("#quiz-completed");
const questionText = document.querySelector("#questionText");
const progressBar = document.querySelector("#quiz-progress");
const timeoutLabel = document.querySelector("#time-out");
const finalScore = document.querySelector("#final-score");
const totalQuestionsDisplay = document.querySelector("#total-questions");
const completedCategory = document.querySelector("#completed-category");
const playAgainBtn = document.querySelector("#play-again");

// ========== Application State ==========
let selectedQuiz = null;
let selectedAnswer = null;
let score = 0;
let currentQuestionIndex = 0;
let timeLeft = 100;
let timerInterval = null;

// ========== Theme Toggle ==========
themeToggle.addEventListener("change", (e) => {
  const isDarkMode = e.target.checked;
  isDarkMode
    ? document.body.classList.add("dark")
    : document.body.classList.remove("dark");
  localStorage.setItem("selectedTheme", isDarkMode);
});

// ========== Option Selection ==========
optionsList.addEventListener("click", (e) => {
  const clickedBtn = e.target.closest(".btn");
  if (clickedBtn && !clickedBtn.classList.contains("disabled")) {
    emptyMessage.style.display = "none";
    document.querySelectorAll("#options-list .btn").forEach((btn) => {
      btn.classList.remove("selected");
    });
    clickedBtn.classList.add("selected");
    selectedAnswer = clickedBtn.getAttribute("data-option");
  }
});

// ========== Submit Answer ==========
submitBtn.addEventListener("click", () => {
  const questions = selectedQuiz.questions;

  if (submitBtn.textContent === "Next Question") {
    startTimer();
    timeoutLabel.style.display = "none";
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      currentNum.innerText = currentQuestionIndex + 1;
      const nextQuestion = questions[currentQuestionIndex];
      renderQuestion(nextQuestion);
      renderOptions(nextQuestion.options);
      submitBtn.textContent = "Submit Answer";
      selectedAnswer = null;
    } else {
      clearInterval(timerInterval);
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
  const allBtns = document.querySelectorAll("#options-list .btn");

  if (selectedAnswer === "timeout") {
    // Timeout handled
  } else if (selectedAnswer === correctAnswer) {
    currentBtn.classList.add("correct");
    score++;
  } else {
    currentBtn.classList.add("error");
    allBtns.forEach((btn) => {
      if (btn.getAttribute("data-option") === correctAnswer) {
        btn.classList.add("show-correct");
      }
    });
  }

  allBtns.forEach((btn) => btn.classList.add("disabled"));
  submitBtn.textContent = "Next Question";
});

// ========== Category Selection ==========
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const categoryName = e.currentTarget
      .querySelector(".btnCategoriValue")
      .textContent.trim()
      .toUpperCase();

    try {
      const allData = await getData();
      selectedQuiz = allData.quizzes.find(
        (quiz) => quiz.title.toUpperCase() === categoryName
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
        startTimer();
      }
    } catch (error) {
      console.error("Failed to load quiz data:", error);
    }
  });
});

// ========== Quiz Completion ==========
function showResult() {
  quizScreen.classList.add("hidden");
  quizCompleted.classList.remove("hidden");

  finalScore.textContent = score;
  totalQuestionsDisplay.textContent = selectedQuiz.questions.length;

  completedCategory.querySelector("img").src = selectedQuiz.icon;
  completedCategory.querySelector("span").textContent = selectedQuiz.title;
}

// ========== Play Again Handler ==========
playAgainBtn.addEventListener("click", resetGame);

function resetGame() {
  score = 0;
  currentQuestionIndex = 0;
  selectedQuiz = null;
  selectedAnswer = null;

  quizCompleted.classList.add("hidden");
  activeCategory.classList.add("hidden");
  startMenu.classList.remove("hidden");
}

// ========== Render Functions ==========
function renderQuestion(questionData) {
  questionText.textContent = questionData.question;
}

function renderOptions(options) {
  const optionsHTML = options
    .map((option, index) => {
      const letter = String.fromCharCode(65 + index);
      return `
<button class="btn bg-color-white" type="button" data-option="${option}">
  <span class="fs-s quiz-menu-char fs-s-mobile">${letter}</span>
  <span class="fs-s fw-medium fs-s-mobile text-color">${option}</span>
</button>`;
    })
    .join("");
  optionsList.innerHTML = optionsHTML;
}

// ========== Timer Functions ==========
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 100;

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    progressBar.value = timeLeft;
    progressBar.style.setProperty("--progress", `${timeLeft}%`);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 100);
}

function handleTimeOut() {
  const questions = selectedQuiz.questions;
  const correctAnswer = questions[currentQuestionIndex].answer;
  const allBtns = document.querySelectorAll("#options-list .btn");

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

