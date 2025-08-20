# CookieNeonBot — Tap to Earn (Telegram WebApp + Bot)

Jeu **tap-tap** sur un cookie néon (bleu) avec bonus quotidien, parrainage et limite de taps/jour.

## Fonctionnalités
- Tap-tap sur un cookie **Neon LED bleu** qui s'illumine à chaque tap
- **1 tap = 1 point**
- **Limite 2000 taps / jour** (réinitialisation à minuit UTC par défaut)
- **Bonus quotidien : +10 points**
- **Parrainage : +100 points** pour le parrain quand un filleul rejoint via le lien
- Bouton « Ouvrir le jeu » dans le bot Telegram (WebApp/URL)
- Classement local (optionnel) et infos joueur

> ⚠️ Sécurité simplifiée pour dev local : l'ID Telegram de l'utilisateur est passé en paramètre d'URL (`?tg_id=`). Pour production, utilisez la vérification **Telegram WebApp initData**.
> Ce projet est prêt pour du test rapide en local (Mac + VS Code).

## Prérequis
- macOS (MacBook Air ok), Node.js 18+
- Un bot Telegram (via @BotFather) → récupérez `BOT_TOKEN`
- (Optionnel) Tunnel type `ngrok` si vous voulez ouvrir le jeu depuis Telegram sur mobile

## Installation
```bash
cp .env.example .env
# éditez .env avec vos valeurs

npm install
npm run dev       # démarre le serveur (front + API)
npm run bot       # démarre le bot
```
Ouvrez http://localhost:3000 pour tester le jeu dans le navigateur.
Depuis Telegram, parlez à votre bot et tapez `/start` puis « Ouvrir le jeu ».


## Réglages de jeu
- Limite par jour: 2000 taps (modifiable via `GAME_CONFIG` dans `server.js`)
- Bonus quotidien: 10 points
- Parrainage: 100 points

## Lien de parrainage
Dans Telegram, envoyez la commande `/link` pour recevoir :  
`t.me/<VotreBot>?start=<votre_tg_id>`  
Quand un nouveau joueur rejoint avec ce lien, vous gagnez **+100**.

## Structure
```
cookie-neon-bot/
  bot.js          # Bot Telegram (polling)
  server.js       # API + front (Express)
  db.js           # Schéma & accès SQLite (better-sqlite3)
  public/
    index.html
    app.js
    styles.css
    assets/cookie.svg
  package.json
  .env.example
  README.md
```
## Notes techniques
- La limite journalière et le bonus se calculent côté serveur (anti-triche basique).
- Les taps sont envoyés **par paquets** (batch) depuis le client pour réduire le trafic.
- Le fuseau du reset est en UTC. Vous pouvez l’adapter facilement.

## Licence
MIT. Utilisez et modifiez librement.
# Cookie-Neon
# cookie-neon-bottt
