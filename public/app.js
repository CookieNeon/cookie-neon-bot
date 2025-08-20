const $ = (s)=> document.querySelector(s);

const params = new URLSearchParams(location.search);
const tg_id = params.get('tg_id');
const username = params.get('username') || '';

let CONFIG = { DAILY_TAP_LIMIT: 2000 };
let points = 0;
let tapsToday = 0;
let queue = 0;
let sending = false;
let bonusShown = false;

function updateUI(){
  $('#points').textContent = points;
  $('#taps').textContent = tapsToday;
  $('#limit').textContent = CONFIG.DAILY_TAP_LIMIT;
}

async function init(){
  if (!tg_id){
    alert('tg_id manquant. Ouvrez le jeu via le bot Telegram.');
    return;
  }
  const res = await fetch(`/api/me?tg_id=${tg_id}&username=${encodeURIComponent(username)}`);
  const data = await res.json();
  if (!data.ok){ alert('Erreur init'); return; }
  CONFIG = data.config;
  points = data.user.points;
  tapsToday = data.user.tap_count_today;
  updateUI();
  if (data.daily_bonus_granted && !bonusShown){
    $('#bonus').textContent = '🎁 Bonus quotidien: +10 points';
    bonusShown = true;
    setTimeout(()=> $('#bonus').textContent='', 3500);
  }
}

async function flush(){
  if (sending || queue === 0) return;
  sending = true;
  try{
    const count = queue; // snapshot
    const res = await fetch('/api/tap', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ tg_id, count })
    });
    const data = await res.json();
    if (data.ok){
      // Applied = how many taps accepted
      points = data.points;
      tapsToday = data.tap_count_today;
      updateUI();
      // If some taps were rejected due to limit, reset local allowance
      if (data.applied < count){
        // reached limit
        queue = 0;
        $('#tapBtn').disabled = true;
        $('#tapBtn').textContent = 'Limite atteinte';
        $('#cookie').classList.remove('active');
      }else{
        queue -= count;
      }
    }
  }catch(e){
    // ignore (offline)
  }finally{
    sending = false;
  }
}

function localTap(){
  if ($('#tapBtn').disabled) return;
  queue += 1;
  tapsToday += 1;
  points += 1;
  $('#cookie').classList.add('active');
  setTimeout(()=> $('#cookie').classList.remove('active'), 80);
  updateUI();
  flush();
}

$('#cookie').addEventListener('click', localTap);
$('#tapBtn').addEventListener('click', localTap);

// Batching cadence
setInterval(flush, 650);

init();
