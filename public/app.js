let score = 0;

const button = document.getElementById("tapButton");
const scoreDisplay = document.getElementById("score");

button.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = score;
});
