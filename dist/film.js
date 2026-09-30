/* Filme de fundo da abertura: toca sozinho, sem som e em loop, enquanto as caixas rolam por cima.
   No desktop o enquadramento acompanha o assunto do vídeo vertical conforme ele avança.
   Pausa fora da tela, com a aba oculta, com "Pausar animações" ou com prefers-reduced-motion. */
(()=>{
  const section=document.querySelector('[data-film]');
  if(!section)return;
  const video=section.querySelector('video');
  const source=video.querySelector('source');
  const toggle=section.querySelector('.film-play');
  const bar=section.querySelector('.journey-progress>span');
  const chapterEls=[...section.querySelectorAll('[data-chapter]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;

  /* Tempo → centro vertical do enquadramento (fração da altura do vídeo): corrida, tigela, mesa. */
  const framing=[[0,.3],[4,.32],[5.4,.52],[8,.5],[12,.46]];
  const chapters=[4.5,8];

  let visible=false,userPaused=false,motionOff=document.documentElement.classList.contains('no-motion'),frame=0,lastChapter=-1,smoothY=.3;

  function piecewise(points,x){
    for(let i=1;i<points.length;i++){
      const [x0,y0]=points[i-1],[x1,y1]=points[i];
      if(x<=x1)return lerp(y0,y1,clamp((x-x0)/(x1-x0)));
    }
    return points[points.length-1][1];
  }
  function frameTo(t,instant){
    const w=video.clientWidth,h=video.clientHeight;
    const vw=video.videoWidth||720,vh=video.videoHeight||1280;
    const band=h/(vh*Math.max(w/vw,h/vh));
    const target=band>=.995?.5:clamp((piecewise(framing,t)-band/2)/(1-band));
    /* Suaviza a volta do loop (mesa → corrida) em vez de saltar. */
    smoothY=instant?target:smoothY+(target-smoothY)*.08;
    video.style.objectPosition=`50% ${(smoothY*100).toFixed(2)}%`;
  }
  function paint(instant){
    frame=0;
    const t=video.currentTime||0,d=Number.isFinite(video.duration)&&video.duration>0?video.duration:12;
    if(bar)bar.style.transform=`scaleY(${(t/d).toFixed(4)})`;
    frameTo(t,instant);
    const index=t<chapters[0]?0:t<chapters[1]?1:2;
    if(index!==lastChapter){lastChapter=index;chapterEls.forEach((el,i)=>el.classList.toggle('active',i===index));}
    if(!video.paused)frame=requestAnimationFrame(()=>paint(false));
  }
  function shade(){
    const rect=section.getBoundingClientRect();
    const p=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));
    section.style.setProperty('--shade',(1-clamp(p*3)).toFixed(3));
  }
  const canAutoplay=()=>!reduced.matches&&!motionOff&&!userPaused;
  function load(){if(!source.src){source.src=source.dataset.src;video.load();}}
  function syncButton(){
    const playing=!video.paused;
    toggle.textContent=playing?'Pausar filme':'Reproduzir filme';
    toggle.setAttribute('aria-pressed',String(!playing));
  }
  async function start(){
    load();
    try{await video.play();}catch{/* Autoplay bloqueado: o poster fica e o botão continua disponível. */}
    syncButton();
  }
  function stop(){video.pause();syncButton();}
  function update(){
    if(visible&&!document.hidden&&canAutoplay())start();
    else if(!video.paused)stop();
  }

  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{rootMargin:'100px'}).observe(section);
  video.addEventListener('play',()=>{cancelAnimationFrame(frame);paint(false);syncButton();});
  video.addEventListener('pause',syncButton);
  video.addEventListener('loadedmetadata',()=>paint(true));
  video.addEventListener('error',()=>{section.classList.add('film-static');toggle.hidden=true;},true);
  toggle.addEventListener('click',()=>{
    if(video.paused){userPaused=false;motionOff=false;start();}
    else{userPaused=true;stop();}
  });
  reduced.addEventListener('change',update);
  document.addEventListener('visibilitychange',update);
  document.addEventListener('muni:motion',event=>{motionOff=!event.detail.on;if(event.detail.on)userPaused=false;update();});
  addEventListener('scroll',shade,{passive:true});
  addEventListener('resize',()=>{frameTo(video.currentTime||0,true);shade();},{passive:true});

  section.classList.toggle('film-static',reduced.matches);
  load();shade();paint(true);syncButton();
})();
