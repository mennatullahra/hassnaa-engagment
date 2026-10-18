'use strict';
const EVENT_START = new Date('2026-11-14T19:00:00+02:00'); // Cairo, November 2026 (UTC+02)
const EVENT_END = new Date('2026-11-14T23:00:00+02:00');
const MAP_URL = 'https://maps.app.goo.gl/gf3uYpoaPp2fV1oQ9?g_st=ic';
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
document.getElementById('rsvpForm').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('guestName').value.trim();if(!name)return;const yes=document.getElementById('attending').value==='yes';const count=yes?document.getElementById('guestCount').value:'0';const message=`رد على دعوة خطوبة حسناء وعبدالله 💍\nالاسم: ${name}\n${yes?'بإذن الله هحضر ❤️':'للأسف مش هقدر أحضر'}\n${yes?'عدد الحضور: '+count:''}`;const link='https://wa.me/?text='+encodeURIComponent(message);window.open(link,'_blank','noopener,noreferrer');document.getElementById('rsvpStatus').textContent='تم تجهيز الرد على واتساب. اختاري الشخص الذي تريدين إرسال الرد إليه. / Your reply is ready to share on WhatsApp.';});
// Play the uploaded song from 00:51 after the first envelope tap.
const musicBtn = document.getElementById('musicBtn');
const music = new Audio('./engagement-song.mp3');
music.preload = 'auto';
music.autoplay = true;
const START_AT = 51;
let songStarted = false;
function updateMusicButton() {
  const playing = !music.paused;
  musicBtn.setAttribute('aria-pressed', String(playing));
  document.getElementById('musicLabel').textContent = playing ? 'Music On' : 'Music Off';
}
function seekToStart() {
  if (Number.isFinite(music.duration) && music.duration > START_AT) music.currentTime = START_AT;
}
music.addEventListener('loadedmetadata', () => {
  if (!songStarted || music.currentTime < START_AT) seekToStart();
});
music.addEventListener('ended', () => {
  seekToStart();
  music.play().catch(updateMusicButton);
});
music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
function startSong() {
  if (songStarted) return;
  songStarted = true;
  seekToStart();
  music.play().catch(() => { updateMusicButton(); });
}
document.getElementById('envelopeScene').addEventListener('click', startSong);
document.getElementById('envelopeScene').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') startSong();
});
musicBtn.addEventListener('click', () => {
  if (music.paused) {
    songStarted = true;
    if (music.currentTime < START_AT) seekToStart();
    music.play().catch(updateMusicButton);
  } else music.pause();
});

// Try to start music by default. Mobile browsers may require a guest tap.
function attemptAutoplay() {
  if (songStarted) return;
  seekToStart();
  music.play().then(() => { songStarted = true; }).catch(() => {
    updateMusicButton(); // First envelope tap or Music button will start playback.
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attemptAutoplay, { once: true });
} else {
  attemptAutoplay();
}
