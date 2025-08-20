// Récupération user_id et username depuis l’URL
const urlParams = new URLSearchParams(window.location.search);
const user_id = urlParams.get("user_id");
const username = urlParams.get("username");

let score = 0;
const cookie = document.getElementById("cookie");
const scoreDisplay = document.getElementById("score");

// Charger score depuis le serveur
async function loadScore() {
  const res = await fetch(`/score/${user_id}`);
  const data = await res.json();
  score = data.score || 0;
  scoreDisplay.textContent = score;
}

// Sauvegarder score
async function saveScore() {
  await fetch("/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, username, score }),
  });
}

// Incrémentation quand on clique sur le cookie
cookie.addEventListener("click", async () => {
  score++;
  scoreDisplay.textContent = score;
  await saveScore();
});

// Charger le score au démarrage
loadScore();
