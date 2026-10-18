'use strict';
const EVENT_START = new Date('2026-11-14T19:00:00+02:00'); // Cairo, November 2026 (UTC+02)
const EVENT_END = new Date('2026-11-14T23:00:00+02:00');
const MAP_URL = 'https://maps.app.goo.gl/pJXNiPYhiGQ7qntH6?g_st=aw';
const envelope = document.getElementById('envelope');
function openEnvelope(){envelope.classList.toggle('open');document.getElementById('tapHint').textContent=envelope.classList.contains('open')?'♡ تم فتح الدعوة · Invitation opened':'اضغطي على الظرف لفتح الدعوة · Tap to open';}
document.getElementById('envelopeScene').addEventListener('click',openEnvelope);
document.getElementById('envelopeScene').setAttribute('role','button');document.getElementById('envelopeScene').setAttribute('tabindex','0');document.getElementById('envelopeScene').setAttribute('aria-label','Open or close the invitation envelope');
document.getElementById('envelopeScene').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openEnvelope();}});
function tick(){const remaining=Math.max(0,EVENT_START-Date.now());const secs=Math.floor(remaining/1000);const parts=[Math.floor(secs/86400),Math.floor(secs%86400/3600),Math.floor(secs%3600/60),secs%60];['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=String(parts[i]).padStart(2,'0'));if(remaining===0)document.getElementById('countdownMessage').textContent='اليوم يوم فرحتنا! ♡ It’s our special day!';}
tick();setInterval(tick,1000);
const calendar=document.getElementById('calendarDays');const first=new Date(2026,10,1).getDay();for(let i=0;i<first;i++){calendar.appendChild(document.createElement('span'));}for(let day=1;day<=30;day++){const el=document.createElement('span');el.textContent=day;if(day===14){el.className='highlight';el.setAttribute('aria-label','Engagement day, November 14');}calendar.appendChild(el);}
const fmt=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
const calendarUrl=new URL('https://calendar.google.com/calendar/render');calendarUrl.searchParams.set('action','TEMPLATE');calendarUrl.searchParams.set('text','خطوبة حسناء وعبدالله | Hasnaa & Abdullah Engagement');calendarUrl.searchParams.set('dates',fmt(EVENT_START)+'/'+fmt(EVENT_END));calendarUrl.searchParams.set('details','Join us to celebrate the engagement of Hasnaa & Abdullah! '+MAP_URL);calendarUrl.searchParams.set('location',MAP_URL);document.getElementById('calendarLink').href=calendarUrl.toString();
// Set the host's WhatsApp number in international format, e.g. 201XXXXXXXXX.
const RSVP_WHATSAPP_NUMBER = 'REPLACE_WITH_HOST_WHATSAPP_NUMBER';
const rsvpForm = document.getElementById('rsvpForm');
rsvpForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  if (!name) return;
  if (!/^\d{10,15}$/.test(RSVP_WHATSAPP_NUMBER)) {
    document.getElementById('rsvpStatus').textContent = 'رقم واتساب استقبال الردود لم يتم إضافته بعد.';
    return;
  }
  const attending = document.getElementById('attending').value === 'yes';
  const message = `تأكيد حضور خطوبة حسناء وعبدالله 💍\nالاسم: ${name}\nالحضور: ${attending ? 'بإذن الله هحضر ❤️' : 'للأسف مش هقدر أحضر'}`;
  const url = `https://wa.me/${RSVP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
});
// Music button stays responsive; begin at 00:51 after metadata is available.
const musicBtn = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');
const music = new Audio('./engagement-song.mp3');
const START_AT = 51;
music.preload = 'auto';
let musicWanted = true;
let musicStarted = false;
function updateMusicUI() {
  musicBtn.setAttribute('aria-pressed', String(musicWanted));
  musicLabel.textContent = musicWanted ? 'Music On' : 'Music Off';
}
function startFrom51() {
  if (!musicWanted) return;
  if (!musicStarted && music.readyState >= 1) {
    if (Number.isFinite(music.duration) && music.duration <= START_AT) return;
    music.currentTime = START_AT;
    musicStarted = true;
  }
  if (musicStarted) music.play().catch(() => {});
  else music.load();
}
music.addEventListener('loadedmetadata', startFrom51);
music.addEventListener('ended', () => { musicStarted = false; startFrom51(); });
musicBtn.addEventListener('click', () => {
  musicWanted = !musicWanted;
  updateMusicUI();
  if (musicWanted) startFrom51(); else music.pause();
});
document.getElementById('envelopeScene').addEventListener('click', startFrom51);
updateMusicUI();
