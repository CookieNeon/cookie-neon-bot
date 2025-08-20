let userId = localStorage.getItem("userId") || "user_" + Math.floor(Math.random() * 100000);
localStorage.setItem("userId", userId);

let scoreEl = document.getElementById("score");
let leaderboardEl = document.getElementById("leaderboard");

// Clic sur cookie
document.getElementById("cookie").addEventListener("click", () => {
  fetch("/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })
    .then(res => res.json())
    .then(data => {
      scoreEl.textContent = data.score;
      loadLeaderboard();
    });
});

// Bonus quotidien
document.getElementById("bonusBtn").addEventListener("click", () => {
  fetch("/bonus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.bonusGiven) {
        alert("🎁 Bonus reçu (+25 points) !");
      } else {
        alert("Déjà pris aujourd’hui !");
      }
      loadLeaderboard();
    });
});

// Parrainage
document.getElementById("inviteBtn").addEventListener("click", () => {
  const link = `https://t.me/TON_BOT?start=${userId}`;
  navigator.clipboard.writeText(link);
  alert("Lien copié ! Envoie-le à tes amis 🔥");
});

// Classement
function loadLeaderboard() {
  fetch("/leaderboard")
    .then(res => res.json())
    .then(data => {
      leaderboardEl.innerHTML = "";
      data.forEach((player, i) => {
        let li = document.createElement("li");
        li.textContent = `#${i + 1} ${player.username || player.id} - ${player.score}`;
        leaderboardEl.appendChild(li);
      });
    });
}
loadLeaderboard();
