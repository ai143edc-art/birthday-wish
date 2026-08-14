/* =========================================================
   Birthday Surprise — AUTO-PLAY MOVIE
   She taps "start" once, then everything plays by itself.
   Edit ONLY the CONFIG block below.
   ========================================================= */

/* ====================  ✏️  EDIT ME  ==================== */
const CONFIG = {
  sisterName: "Priyanka",       // 👉 your sister's name
  brotherName: "Vikku",     // 👉 how you sign off
  birthdayDate: "15 August",    // 👉 her birthday (shown under the name)

  birthdayMessage:
    "You are not just my sister, you're one of the most special people in my life.\n\n" +
    "We may fight and argue over silly things — but behind all of that is a bond I would never trade for anything.\n\n" +
    "You deserve every bit of happiness, success and peace this year brings.\n\n" +
    "Thank you for being my sister. ❤",

  finalMessage: "You deserve all the happiness in the world.",

  musicEnabled: true,
  musicSrc: "audio/birthday.mp3",   // 👉 replace with your song

  // Photos for the slideshow. Empty = pretty placeholders.
  photos: [
    "images/photo1.jpg",
    "images/photo2.jpg",
    "images/photo3.jpg",
    "images/photo4.jpg",
  ],
  // One caption per slide (loops if fewer than photos)
  slideCaptions: [
    "Where it all began…",
    "Growing up together",
    "Always by your side",
    "My favourite person",
  ],

  // A short video to include in the slideshow. It plays with its own sound,
  // and the background music gently ducks while it plays. "" = no video.
  videoSrc: "video/memory.mp4",
  videoCaption: "A moment I'll always treasure ❤",
  videoPosition: "end",   // "end" (after the photos) or "start" (before them)
};
/* ==================  END OF EDIT AREA  ================== */


/* -------- helpers -------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
const el = (t, a={}) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); return n; };
const wait = ms => new Promise(r => setTimeout(r, ms));
/* movie speed: reduced-motion users get a faster, calmer cut */
const T = REDUCED ? 0.5 : 1;

/* Low-power phone detection → fewer particles/confetti so it stays smooth.
   Signals: low RAM, few CPU cores, or a very small screen. */
const LOW = (() => {
  const mem = navigator.deviceMemory || 8;         // GB (Chrome/Android)
  const cpu = navigator.hardwareConcurrency || 8;  // cores
  const smallArea = (innerWidth * innerHeight) < 380 * 720;
  return mem <= 4 || cpu <= 4 || smallArea;
})();
/* overall effect budget: 1 = full, lower = lighter */
const FXQ = REDUCED ? 0.3 : (LOW ? 0.55 : 1);
const q = n => Math.max(1, Math.round(n * FXQ));

/* ============================================================
   REAL VISIBLE HEIGHT (fixes mobile URL-bar cut-off)
   Keeps CSS var --app-h equal to the actually-visible height,
   so nothing gets hidden behind the phone's address bar.
   ============================================================ */
function syncAppHeight(){
  const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  document.documentElement.style.setProperty("--app-h", h + "px");
}

/* ============================================================
   BACKGROUND PARTICLES
   ============================================================ */
function ambientParticles(){
  const cv = $("#ambient"), ctx = cv.getContext("2d");
  let W,H,dots=[],raf;
  const base = LOW ? 18 : Math.min(70, Math.floor(innerWidth/13));
  const COUNT = REDUCED ? 20 : base;
  const DPR = Math.min(devicePixelRatio || 1, LOW ? 1 : 2);
  function size(){
    W = innerWidth; H = (window.visualViewport && window.visualViewport.height) || innerHeight;
    cv.width = W*DPR; cv.height = H*DPR; cv.style.width=W+"px"; cv.style.height=H+"px";
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  function seed(){ dots = Array.from({length:COUNT}, () => ({
    x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+0.4,s:Math.random()*0.3+0.05,
    a:Math.random()*0.6+0.2,hue:Math.random()<0.5?"rgba(255,207,138,":"rgba(247,179,212," })); }
  function frame(){ ctx.clearRect(0,0,W,H);
    for(const d of dots){ d.y-=d.s; if(d.y<-4){d.y=H+4;d.x=Math.random()*W;}
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,7); ctx.fillStyle=d.hue+d.a+")"; ctx.fill(); }
    raf=requestAnimationFrame(frame); }
  size(); seed();
  if(REDUCED){ for(const d of dots){ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,7);ctx.fillStyle=d.hue+d.a+")";ctx.fill();} }
  else frame();
  // Ignore tiny height changes (mobile URL bar) so particles don't jump/reseed constantly.
  let lastW = innerWidth;
  addEventListener("resize",()=>{
    if(Math.abs(innerWidth-lastW) < 2 && !REDUCED) { size(); return; } // height-only change: just resize
    lastW = innerWidth;
    cancelAnimationFrame(raf); size(); seed(); if(!REDUCED)frame();
  },{passive:true});
}

/* ============================================================
   CONFETTI / FIREWORKS (full-screen layer)
   ============================================================ */
function makeFx(canvas){
  const ctx=canvas.getContext("2d"); let W,H,parts=[],raf=null;
  const colors=["#ffcf8a","#f7b3d4","#c9a4e6","#ffb454","#fff2c2"];
  const DPR = Math.min(devicePixelRatio || 1, LOW ? 1 : 2);
  function size(){
    W=innerWidth; H=(window.visualViewport && window.visualViewport.height) || innerHeight;
    canvas.width=W*DPR; canvas.height=H*DPR; canvas.style.width=W+"px"; canvas.style.height=H+"px";
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  size(); addEventListener("resize",size,{passive:true});
  function confetti(n=120){ n=q(REDUCED?34:n);
    for(let i=0;i<n;i++)parts.push({x:Math.random()*W,y:-10,vx:(Math.random()-0.5)*3,vy:Math.random()*3+2,
      s:Math.random()*6+3,c:colors[i%colors.length],rot:Math.random()*6,vr:(Math.random()-0.5)*0.3,life:1}); run(); }
  function firework(x=Math.random()*W,y=Math.random()*H*0.5+40){ const n=q(REDUCED?18:48);
    for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2,sp=Math.random()*3+1.5;
      parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,s:Math.random()*3+1.5,c:colors[i%colors.length],rot:0,vr:0,life:1,g:0.03});} run(); }
  function run(){ if(!raf)raf=requestAnimationFrame(frame); }
  function frame(){ ctx.clearRect(0,0,W,H); parts=parts.filter(p=>p.life>0);
    for(const p of parts){ p.x+=p.vx;p.y+=p.vy;p.vy+=(p.g??0.06);p.rot+=p.vr;p.life-=0.008;
      ctx.save();ctx.globalAlpha=Math.max(p.life,0);ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s);ctx.restore(); }
    if(parts.length)raf=requestAnimationFrame(frame); else{cancelAnimationFrame(raf);raf=null;ctx.clearRect(0,0,W,H);} }
  return { confetti, firework };
}
let FX = null;

/* ============================================================
   TEXT INJECTION
   ============================================================ */
function injectText(){
  const nameEl = $("#revealName");
  [...CONFIG.sisterName].forEach((ch,i)=>{
    const s=document.createElement("span"); s.className="ltr";
    s.textContent = ch===" " ? " " : ch;
    s.style.animationDelay = (0.3 + i*0.09) + "s";
    nameEl.appendChild(s);
  });
  $("#finalName").textContent = CONFIG.sisterName;
  $("#revealDate").textContent = CONFIG.birthdayDate ? CONFIG.birthdayDate + " 🎂" : "";
  $("#finalMsg").textContent  = CONFIG.finalMessage;
  $("#finalSign").textContent = "— " + CONFIG.brotherName;
  buildSlides();
}

/* Warm up the slideshow photos early so they're ready when the scene arrives. */
function preloadPhotos(){
  (CONFIG.photos || []).forEach(src => { if(src){ const im=new Image(); im.src=src; } });
}

/* ============================================================
   SCENE 2: TREE
   ============================================================ */
function heartPoint(t,cx,cy,sc){
  const x=16*Math.sin(t)**3;
  const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
  return {x:cx+x*sc,y:cy-y*sc};
}
async function growTree(){
  const gGround=$("#ground"),gSeed=$("#seed");
  const branches=$("#branches"),leaves=$("#leaves"),lights=$("#lights"),balloons=$("#balloons");
  gSeed.classList.add("show"); await wait(600*T);
  gGround.classList.add("show"); await wait(600*T);
  const segs=[];
  function grow(x,y,ang,len,w,depth){
    if(depth>5||len<14)return;
    const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;
    segs.push([x,y,x2,y2,w,depth]);
    const spread=0.5+Math.random()*0.25;
    grow(x2,y2,ang-spread,len*0.75,w*0.7,depth+1);
    grow(x2,y2,ang+spread,len*0.75,w*0.7,depth+1);
    if(depth<2)grow(x2,y2,ang+(Math.random()-0.5)*0.3,len*0.8,w*0.72,depth+1);
  }
  grow(200,498,-Math.PI/2,92,15,0);
  segs.sort((a,b)=>a[5]-b[5]);
  const leafTips=[];
  for(let i=0;i<segs.length;i++){
    const [x1,y1,x2,y2,w,depth]=segs[i];
    const path=el("path",{d:`M${x1} ${y1} L${x2} ${y2}`,"stroke-width":Math.max(w,2)});
    const len=Math.hypot(x2-x1,y2-y1);
    path.style.strokeDasharray=len; path.style.strokeDashoffset=REDUCED?0:len;
    branches.appendChild(path);
    if(!REDUCED)requestAnimationFrame(()=>{path.style.strokeDashoffset=0;});
    if(depth>=3)leafTips.push([x2,y2]);
    await wait(REDUCED?6:48);
  }
  await wait(400*T);
  const lc=["#f7b3d4","#c9a4e6","#e79ad0","#d4a5ea"];
  leafTips.forEach((tip,i)=>{ for(let k=0;k<3;k++){
    const lf=el("circle",{cx:tip[0]+(Math.random()-0.5)*22,cy:tip[1]+(Math.random()-0.5)*22,
      r:6+Math.random()*5,fill:lc[(i+k)%lc.length],class:"leaf"});
    lf.style.animationDelay=(i*36+k*28)+"ms"; leaves.appendChild(lf);
    requestAnimationFrame(()=>lf.classList.add("show")); } });
  await wait(800*T);
  leafTips.forEach((tip,i)=>{ if(i%2)return;
    const d=el("circle",{cx:tip[0],cy:tip[1],r:2.6,fill:"#ffe6b0",class:"light-dot"});
    d.style.filter="drop-shadow(0 0 6px rgba(255,207,138,.9))"; d.style.animationDelay=(i*55)+"ms";
    lights.appendChild(d); requestAnimationFrame(()=>d.classList.add("show")); });
  await wait(700*T);
  const N=22,bc=["#f7b3d4","#ffcf8a","#c9a4e6","#ff9ec4","#ffb454","#b98ee0"];
  for(let i=0;i<N;i++){
    const t=(i/N)*Math.PI*2; const pt=heartPoint(t,200,150,6.6);
    const g=el("g",{class:"balloon"}); const col=bc[i%bc.length]; const rx=9+Math.random()*2,ry=rx*1.18;
    g.appendChild(el("line",{x1:pt.x,y1:pt.y+ry,x2:pt.x,y2:pt.y+ry+16,stroke:"rgba(255,255,255,.4)","stroke-width":1}));
    g.appendChild(el("ellipse",{cx:pt.x,cy:pt.y,rx,ry,fill:col,filter:`drop-shadow(0 0 8px ${col}88)`}));
    g.appendChild(el("ellipse",{cx:pt.x-rx*0.35,cy:pt.y-ry*0.35,rx:rx*0.28,ry:ry*0.32,fill:"rgba(255,255,255,.55)"}));
    g.style.animationDelay=(i*(REDUCED?4:50))+"ms"; balloons.appendChild(g);
    requestAnimationFrame(()=>g.classList.add("rise"));
  }
  await wait(REDUCED?300:1600);
  balloons.classList.add("float");
  $("#treeCaption").classList.add("show");
  await wait(1200*T);
}

/* ============================================================
   SCENE 3: MESSAGE (typewriter, then wait)
   ============================================================ */
function typeMessage(){
  return new Promise(resolve=>{
    const target=$("#typedMessage"); const text=CONFIG.birthdayMessage;
    if(REDUCED){ target.textContent=text; resolve(); return; }
    let i=0; target.textContent="";
    const caret=document.createElement("span"); caret.className="caret"; target.appendChild(caret);
    const speed=26;
    (function step(){
      if(i<text.length){ caret.insertAdjacentText("beforebegin",text[i]); i++;
        setTimeout(step, text[i-1]==="\n"?speed*6:speed);
      } else { setTimeout(()=>{caret.remove(); resolve();}, 900); }
    })();
  });
}

/* ============================================================
   SCENE 4: SLIDESHOW (auto-advance)
   ============================================================ */
let slides=[], slideKind=[], slideVideos=[], slideCaps=[];
function buildSlides(){
  const wrap=$("#slides");
  const caps=CONFIG.slideCaptions||[];
  const items=[];
  const photos = CONFIG.photos.length ? CONFIG.photos : ["","","",""];
  photos.forEach((src,i)=> items.push({type:"image",src,cap:caps.length?caps[i%caps.length]:""}));
  // slot the video in at the start or the end
  if(CONFIG.videoSrc){
    const vitem={type:"video",src:CONFIG.videoSrc,cap:CONFIG.videoCaption||""};
    if(CONFIG.videoPosition==="start") items.unshift(vitem); else items.push(vitem);
  }

  items.forEach((it,i)=>{
    const s=document.createElement("div");
    s.className="slide"+(i===0?" active":"");
    if(it.type==="video"){
      const v=document.createElement("video");
      v.className="slide-video-el";
      v.src=it.src; v.preload="auto"; v.muted=false; v.controls=false;
      v.playsInline=true; v.setAttribute("playsinline",""); v.setAttribute("webkit-playsinline","");
      v.addEventListener("error",()=>{ s.classList.add("ph"); s.textContent="🎬"; });
      s.appendChild(v);
      slideKind[i]="video"; slideVideos[i]=v;
    } else if(it.src){
      // Full photo (contain) over a blurred fill of itself → nothing gets cut.
      const bg=document.createElement("div"); bg.className="slide-bg"; bg.style.backgroundImage=`url("${it.src}")`;
      const img=document.createElement("div"); img.className="slide-img"; img.style.backgroundImage=`url("${it.src}")`;
      s.appendChild(bg); s.appendChild(img);
      const probe=new Image();
      probe.onerror=()=>{ bg.remove(); img.remove(); s.classList.add("ph"); s.textContent="Photo "+(i+1); };
      probe.src=it.src;
      slideKind[i]="image"; slideVideos[i]=null;
    } else {
      s.classList.add("ph"); s.textContent="Photo "+(i+1);
      slideKind[i]="image"; slideVideos[i]=null;
    }
    slideCaps[i]=it.cap;
    wrap.appendChild(s);
  });
  slides=$$(".slide",wrap);
}
async function playSlides(){
  const cap=$("#slidesCaption");
  function showCap(i){ const t=slideCaps[i];
    if(!t){ cap.classList.remove("show"); return; }
    cap.textContent=t; cap.classList.remove("show"); void cap.offsetWidth; cap.classList.add("show"); }
  const per = 2600*T;
  for(let i=0;i<slides.length;i++){
    if(i>0){ slides[i-1].classList.remove("active"); slides[i].classList.add("active"); }
    showCap(i);
    if(slideKind[i]==="video") await playVideoSlide(i);
    else await wait(per);
  }
}
/* Plays the video slide with its own sound; ducks the music, restores it after.
   Falls back to muted playback if the browser blocks sound, and has a safety
   timeout so the movie never gets stuck if 'ended' doesn't fire. */
async function playVideoSlide(i){
  const v=slideVideos[i];
  if(!v){ await wait(3000*T); return; }
  const musicWasOn = audio && !audio.paused && !muted;
  let restored=false;
  const restoreMusic=()=>{ if(restored)return; restored=true;
    if(musicWasOn && audio){ try{ audio.play().catch(()=>{}); }catch(e){} } };
  if(audio){ try{ audio.pause(); }catch(e){} }   // duck background music
  try{ v.currentTime=0; }catch(e){}
  v.muted=false;
  try{ await v.play(); }
  catch(e){                                       // sound blocked → show it muted, keep music
    v.muted=true; restoreMusic();
    try{ await v.play(); }catch(e2){}
  }
  const dur=(isFinite(v.duration)&&v.duration>0)?v.duration:17;
  await new Promise(res=>{
    let done=false; const finish=()=>{ if(done)return; done=true; res(); };
    v.addEventListener("ended", finish, {once:true});
    setTimeout(finish, (dur+1.4)*1000);
  });
  try{ v.pause(); }catch(e){}
  restoreMusic();
}

/* ============================================================
   SCENE 5: CAKE (candles blow out by themselves)
   ============================================================ */
async function playCake(){
  await wait(1400*T);                 // let her see the lit cake
  $("#cakeEl").classList.add("out");  // candles blow out on their own
  $("#cakeTitle").innerHTML = "Wish sent to the stars <span>🌟</span>";
  const made=$("#wishMade"); made.hidden=false; made.classList.add("show");
  if(!REDUCED){ FX.confetti(140); [0,400,800].forEach(t=>setTimeout(()=>FX.firework(),t)); }
  await wait(1800*T);
}

/* ============================================================
   SCENE 6: FINAL (fireworks loop for a while)
   ============================================================ */
async function playFinal(){
  if(!REDUCED){
    FX.confetti(120);
    const bursts = LOW ? 4 : 6;
    for(let i=0;i<bursts;i++){ FX.firework(); await wait(1100); }
  } else { await wait(1500); }
  // show replay button so she can watch again if she wants
  const rb=$("#replayBtn"); rb.hidden=false; requestAnimationFrame(()=>rb.classList.add("show"));
}

/* ============================================================
   SCENE SWAP
   ============================================================ */
let scenes=[];
async function showScene(idx){
  scenes.forEach((s,i)=>{
    if(i===idx) s.classList.add("show");
    else { s.classList.remove("show"); s.classList.add("leave"); }
  });
  await wait(1100); // matches CSS transition
  scenes.forEach((s,i)=>{ if(i!==idx) s.classList.remove("leave"); });
}

/* ============================================================
   THE DIRECTOR — runs the whole movie start to finish
   ============================================================ */
async function runMovie(){
  scenes = $$(".mscene");

  // Scene 1 — reveal
  await showScene(0);
  const [l1,l2,l3]=[$(".l1"),$(".l2"),$(".l3")];
  await wait(400*T); l1.classList.add("on");
  await wait(2000*T); l2.classList.add("on");
  await wait(2000*T); l3.classList.add("on");
  await wait(600*T);  // name letters animate via CSS
  $("#revealDate").classList.add("on");   // show birthday date
  if(!REDUCED){ FX.confetti(80); setTimeout(()=>FX.firework(),300); }
  await wait(2600*T);

  // Scene 2 — tree
  await showScene(1);
  await growTree();

  // Scene 3 — message
  await showScene(2);
  await wait(500*T);
  await typeMessage();
  await wait(1600*T);

  // Scene 4 — slideshow
  await showScene(3);
  await wait(400*T);
  await playSlides();

  // Scene 5 — cake
  await showScene(4);
  await playCake();

  // Scene 6 — final
  await showScene(5);
  await playFinal();
}

/* ============================================================
   MUSIC
   ============================================================ */
let audio=null, muted=false;
function initMusic(){
  if(!CONFIG.musicEnabled) return;
  audio=new Audio(CONFIG.musicSrc);
  audio.loop=true; audio.volume=0.55;
  audio.preload="auto";
  audio.addEventListener("error",()=>{ $("#soundBtn").hidden=true; }); // missing file → hide control, movie still runs
}
function startMusic(){
  if(!audio) return;
  audio.play().then(()=>{ $("#soundBtn").hidden=false; reflect(); }).catch(()=>{ $("#soundBtn").hidden=true; });
}
function reflect(){ $("#soundIcon").textContent = (audio && !audio.paused && !muted) ? "🔊" : "🔇"; }
function initSoundBtn(){
  $("#soundBtn").addEventListener("click", ()=>{
    if(!audio) return;
    muted=!muted; audio.muted=muted; reflect();
  });
}

/* ============================================================
   START GATE — the ONE tap she makes
   ============================================================ */
function initGate(){
  const gate=$("#gate"), btn=$("#startBtn"), movie=$("#movie");
  btn.addEventListener("click", async ()=>{
    startMusic();                       // user tap → sound allowed
    gate.classList.add("hidden");
    movie.hidden=false;
    FX = makeFx($("#fxLayer"));
    await wait(600);
    gate.style.display="none";
    runMovie();
  });
}

/* ============================================================
   REPLAY
   ============================================================ */
function initReplay(){
  $("#replayBtn").addEventListener("click", ()=>{ location.reload(); });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", ()=>{
  syncAppHeight();
  addEventListener("resize", syncAppHeight, {passive:true});
  addEventListener("orientationchange", syncAppHeight, {passive:true});
  if(window.visualViewport) window.visualViewport.addEventListener("resize", syncAppHeight, {passive:true});

  injectText();
  preloadPhotos();
  ambientParticles();
  initMusic();
  initSoundBtn();
  initGate();
  initReplay();
});
